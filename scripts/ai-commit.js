#!/usr/bin/env node
import { execSync } from 'child_process';
import readline from 'readline';
import fs from 'fs';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY in environment. Create a .env file or set the variable.');
  process.exit(1);
}

function run(cmd) {
  return execSync(cmd, { stdio: ['pipe', 'pipe', 'inherit'] }).toString();
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans); }));
}

async function generateMessage(diff) {
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

    console.log('Generating commit message with AI...');
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

    // push current branch
    const branch = run('git rev-parse --abbrev-ref HEAD').trim();
    console.log(`Pushing to origin/${branch}...`);
    run(`git push origin ${branch}`);
    console.log('Committed and pushed successfully.');
  } catch (err) {
    console.error('Error during ai-commit:', err);
    process.exit(1);
  }
}

main();
