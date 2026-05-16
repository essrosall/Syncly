import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';

const termsContent = (
  <div className="bg-white p-6 rounded-md">
    <div className="prose prose-neutral max-w-none text-sm text-neutral-700 dark:prose-invert dark:text-neutral-300">
      <h2>Terms of Service</h2>
      <p className="lead">These Terms of Service ("Terms") govern your use of Syncly (the "Service"). By creating an account or using the Service you agree to these Terms. If you do not agree, do not use the Service.</p>

      <h3>1. Use of the Service</h3>
      <p>The Service helps individuals and teams manage tasks, projects, and related content. You agree to use the Service only for lawful purposes and in compliance with all applicable laws and regulations.</p>

      <h3>2. Account Responsibilities</h3>
      <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized access.</p>

      <h3>3. User Content</h3>
      <p>You retain ownership of the content you create. By uploading or posting content you grant Syncly a worldwide, non-exclusive license to host, store, and process that content to provide and improve the Service.</p>

      <h3>4. Prohibited Conduct</h3>
      <p>You must not misuse the Service. Prohibited actions include, but are not limited to: violating other users' rights, uploading malware, attempting to reverse-engineer the Service, or using the Service to send spam or unlawful communications.</p>

      <h3>5. Termination</h3>
      <p>We may suspend or terminate accounts that violate these Terms or pose a security risk. You may delete your account at any time; copies of some data may persist for a short time for backup or legal reasons.</p>

      <h3>6. Warranty Disclaimer</h3>
      <p>The Service is provided "as is" and "as available" without warranties of any kind. To the fullest extent permitted by law, Syncly disclaims all warranties, express or implied.</p>

      <h3>7. Limitation of Liability</h3>
      <p>To the extent permitted by law, Syncly and its affiliates are not liable for indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.</p>

      <h3>8. Governing Law</h3>
      <p>These Terms are governed by the laws of the jurisdiction in which Syncly is incorporated, without regard to conflict-of-law provisions.</p>

      <h3>Contact</h3>
      <p>If you have questions about these Terms, contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>

      <p className="text-xs text-neutral-500">These Terms govern your use of Syncly. Please consult legal counsel to adapt these terms for your jurisdiction.</p>
    </div>
  </div>
);

const privacyContent = (
  <div className="bg-white p-6 rounded-md">
    <div className="prose prose-neutral max-w-none text-sm text-neutral-700 dark:prose-invert dark:text-neutral-300">
      <h2>Privacy Policy</h2>
      <p className="lead">Syncly is committed to protecting your privacy. This policy explains how we collect, use, and disclose personal information.</p>

      <h3>1. Information We Collect</h3>
      <p>We collect information you provide when creating an account (such as name and email), content you upload, and usage data (e.g., actions you take within the Service) for the purpose of operating and improving the Service.</p>

      <h3>2. How We Use Information</h3>
      <p>We use personal information to provide and maintain the Service, communicate account-related notices, and to analyze usage to improve features. We may also use information to detect and prevent abuse.</p>

      <h3>3. Sharing and Disclosure</h3>
      <p>We do not sell personal information. We may share data with service providers who process data on our behalf (for storage, email delivery, analytics). We may disclose information to comply with legal obligations or to protect rights and safety.</p>

      <h3>4. Security</h3>
      <p>We implement reasonable administrative, technical, and physical safeguards to protect personal information. No system is completely secure; we cannot guarantee absolute security.</p>

      <h3>5. Data Retention</h3>
      <p>We retain personal data for as long as necessary to provide the Service and for legitimate business purposes, or as required by law.</p>

      <h3>6. Your Rights</h3>
      <p>You may request access to, correction of, or deletion of your personal data. Contact <a href="mailto:support@example.com">support@example.com</a> to submit requests.</p>

      <h3>7. Cookies and Tracking</h3>
      <p>We may use cookies or similar technologies to improve the user experience. You can control cookie settings via your browser.</p>

      <h3>Contact</h3>
      <p>Questions about this Privacy Policy can be directed to <a href="mailto:support@example.com">support@example.com</a>.</p>

      <p className="text-xs text-neutral-500">This Privacy Policy explains how Syncly collects and uses personal information. Please consult legal counsel for specific legal requirements.</p>
    </div>
  </div>
);

const PolicyModal = ({ initialSection = 'terms', isOpen, onClose, onAccept }) => {
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [visitedTerms, setVisitedTerms] = useState(false);
  const [visitedPrivacy, setVisitedPrivacy] = useState(false);

  const canAccept = visitedTerms && visitedPrivacy;

  useEffect(() => {
    if (!isOpen) return;

    setActiveSection(initialSection);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [initialSection, isOpen]);

  const handleAccept = () => {
    if (!canAccept) return;

    if (onAccept) onAccept();
    if (onClose) onClose();
  };

  // Single modal containing both Terms and Privacy sections. The user can jump between
  // sections using the buttons at the top, then confirm once both have been viewed.
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms & Privacy" className="max-w-3xl">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setVisitedTerms(true);
            setActiveSection('terms');
            if (containerRef.current) containerRef.current.scrollTop = 0;
          }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeSection === 'terms'
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Terms of Service
        </button>
        <button
          type="button"
          onClick={() => {
            setVisitedPrivacy(true);
            setActiveSection('privacy');
            if (containerRef.current) containerRef.current.scrollTop = 0;
          }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeSection === 'privacy'
              ? 'bg-neutral-900 text-white'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          Privacy Policy
        </button>
      </div>

      <div ref={containerRef} className="max-h-[60vh] overflow-y-auto pr-4" aria-label="Terms and privacy content">
        {activeSection === 'terms' ? (
          <div className="mb-8">
            {termsContent}
          </div>
        ) : (
          <div className="mb-8">
            {privacyContent}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-700">
        <p className="text-xs text-neutral-500">
          Read both sections, then confirm to continue.
        </p>
        <button
          type="button"
          onClick={handleAccept}
          disabled={!canAccept}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          I have read and accept both
        </button>
      </div>
    </Modal>
  );
};

export default PolicyModal;
