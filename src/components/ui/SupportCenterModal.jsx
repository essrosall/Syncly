import { BookOpen, HelpCircle, Mail, MessageCircle, ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from './index';

const SUPPORT_EMAIL = 'support@syncly.app';
const SUPPORT_ISSUES_URL = 'https://github.com/essrosall/Syncly/issues';
const SUPPORT_DOCS_URL = 'https://github.com/essrosall/Syncly#readme';

const SupportCenterModal = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const openEmailClient = () => {
    const subject = encodeURIComponent('Syncly Support Request');
    const body = encodeURIComponent('Hi Syncly support,\n\nI need help with: ');
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const openLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const supportItems = [
    {
      label: 'Email support',
      description: 'Send us a message from your mail app.',
      icon: Mail,
      action: openEmailClient,
      cta: 'Open email',
    },
    {
      label: 'Browse docs',
      description: 'Read the project README and usage notes.',
      icon: BookOpen,
      action: () => openLink(SUPPORT_DOCS_URL),
      cta: 'Open docs',
    },
    {
      label: 'Report an issue',
      description: 'Open the issue tracker in a new tab.',
      icon: MessageCircle,
      action: () => openLink(SUPPORT_ISSUES_URL),
      cta: 'Open issues',
    },
  ];

  const faqItems = [
    {
      question: 'How do I export my data?',
      answer: 'Open More Options and choose Export Data to download your current app data as a JSON file.',
    },
    {
      question: 'What if sign in fails?',
      answer: 'Use the demo account, create your own account from Sign up, or confirm that your Supabase auth user exists.',
    },
    {
      question: 'Where do I report bugs?',
      answer: 'Use the Report an issue option to open the GitHub issue tracker in a new tab.',
    },
  ];

  return (
    <div className="space-y-4">

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_14px_35px_rgba(17,25,43,0.06)] dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
            <HelpCircle size={18} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">
              Help & Support
            </p>
            <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Get help, read the docs, or contact support without leaving the app.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {supportItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="flex w-full items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-left transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800/80 dark:hover:bg-neutral-700"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm dark:bg-neutral-700 dark:text-neutral-200">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-neutral-950 dark:text-neutral-100">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                    {item.description}
                  </span>
                </span>
                <span className="mt-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {item.cta}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-300">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">Support email</p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{SUPPORT_EMAIL}</p>
            </div>
            <Button variant="secondary" size="sm" className="rounded-md" onClick={copyEmail}>
              <Copy size={14} />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_10px_25px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800/90">
          <p className="text-sm font-semibold tracking-tight text-neutral-950 dark:text-neutral-100">Quick FAQ</p>
          <div className="mt-3 space-y-3">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-lg bg-neutral-50 px-3 py-3 dark:bg-neutral-800">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.question}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1 justify-center rounded-md" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" className="flex-1 justify-center rounded-md" onClick={openEmailClient}>
            <ExternalLink size={16} />
            Contact support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportCenterModal;