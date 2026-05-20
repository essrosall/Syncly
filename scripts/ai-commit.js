#!/usr/bin/env node
import { execSync } from 'child_process';
import readline from 'readline';
import fs from 'fs';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DRY_RUN = process.env.AI_COMMIT_DRY_RUN === '1' || process.env.DRY_RUN === '1';

function run(cmd) {
  return execSync(cmd, { stdio: ['pipe', 'pipe', 'inherit'] }).toString();
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans); }));
}

async function generateMessage(diff) {
  if (OPENAI_API_KEY) {
    const prompt = `Write a concise, imperative git commit message summarizing the following patch. Provide a short title (<=72 chars) and an optional one-line body separated by a blank line. Patch:\n\n${diff}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.2,
      }),
    });

    const data = await res.json();
    const message = data?.choices?.[0]?.message?.content?.trim();
    return message;
  }

  // Fallback: local heuristic generator (free)
  function heuristic() {
    try {
      const nameStatus = run('git diff --cached --name-status');
      const lines = nameStatus.trim().split(/\r?\n/).filter(Boolean);
      const groups = { A: [], M: [], D: [], R: [] };
      for (const line of lines) {
        const parts = line.split(/\s+/);
        const status = parts[0];
        const path = parts[1] || parts.slice(-1)[0];
        const short = path.split('/').slice(-1)[0];
        if (groups[status]) groups[status].push(short);
      }

      const parts = [];
      if (groups.A.length) parts.push(`Add ${groups.A.slice(0,3).join(', ')}`);
      if (groups.M.length) parts.push(`Update ${groups.M.slice(0,3).join(', ')}`);
      if (groups.D.length) parts.push(`Remove ${groups.D.slice(0,3).join(', ')}`);
      if (groups.R.length) parts.push(`Rename ${groups.R.slice(0,3).join(', ')}`);

      let title = parts.join(' / ');
      if (!title) title = 'Update codebase';
      if (title.length > 72) title = title.slice(0, 69) + '...';

      const body = lines.slice(0, 20).join('\n');
      return `${title}\n\n${body}`;
    } catch (e) {
      return 'Update codebase';
    }
  }

  return heuristic();
}

async function main() {
  try {
    // get staged diff; if empty, stage all changes
    let diff = '';
    try {
      diff = run('git diff --cached --patch');
    } catch {
      diff = '';
    }

    if (!diff.trim()) {
      console.log('No staged changes. Staging all modified files...');
      run('git add -A');
      diff = run('git diff --cached --patch');
    }

    if (!diff.trim()) {
      console.log('No changes to commit. Exiting.');
      return;
    }

    // limit diff size
    if (diff.length > 20000) diff = diff.slice(0, 20000) + '\n\n[TRUNCATED]';

    console.log(OPENAI_API_KEY ? 'Generating commit message with AI...' : 'No OPENAI_API_KEY — using local fallback generator...');
    const message = await generateMessage(diff);

    if (!message) {
      console.error('AI did not return a commit message.');
      process.exit(1);
    }

    console.log('\nSuggested commit message:\n');
    console.log('---');
    console.log(message);
    console.log('---\n');

    const answer = (await prompt('Use this message? (Y/n) ')).trim().toLowerCase();
    if (answer === 'n' || answer === 'no') {
      const manual = await prompt('Enter commit message to use (empty to abort):\n');
      if (!manual.trim()) {
        console.log('Aborted. No commit made.');
        process.exit(0);
      }
      await run(`git commit -m "${manual.replace(/"/g, '\\"')}"`);
    } else {
      // commit with AI message
      // ensure message lines are properly quoted
      const safe = message.replace(/"/g, '\\"').replace(/\n/g, '\\n');
      await run(`git commit -m "${safe}"`);
    }

    // push current branch unless dry-run
    const branch = run('git rev-parse --abbrev-ref HEAD').trim();
    if (DRY_RUN) {
      console.log(`DRY RUN: would push to origin/${branch}.`);
    } else {
      console.log(`Pushing to origin/${branch}...`);
      run(`git push origin ${branch}`);
      console.log('Committed and pushed successfully.');
    }
  } catch (err) {
    console.error('Error during ai-commit:', err);
    process.exit(1);
  }
}

main();
