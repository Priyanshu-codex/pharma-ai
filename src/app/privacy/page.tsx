"use client";

import React from "react";
import { LegalPageLayout } from "@/components/shared/LegalPageLayout";
import { Lock, Database, Key, Bell, Cpu, Image as ImageIcon } from "lucide-react";

const TOC = [
  { id: "introduction", title: "Introduction" },
  { id: "information-collected", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Information" },
  { id: "authentication", title: "Authentication Services" },
  { id: "database-rls", title: "Database & Security Controls" },
  { id: "push-notifications", title: "Push Notifications (FCM)" },
  { id: "ai-data", title: "AI Conversations & Prompts" },
  { id: "ocr-images", title: "OCR & Uploaded Images" },
  { id: "cookies-sessions", title: "Cookies & Session Management" },
  { id: "data-security", title: "Data Security Practices" },
  { id: "data-sharing", title: "Data Sharing & Integrations" },
  { id: "data-retention", title: "Data Retention & Storage" },
  { id: "user-rights", title: "Your Rights & Controls" },
  { id: "children-privacy", title: "Children's Privacy" },
  { id: "policy-changes", title: "Policy Changes" },
  { id: "contact-privacy", title: "Contact Privacy Team" },
];

export default function PrivacyPage() {
  const lastUpdated = "24 August 2026";

  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Learn how PharmaAI collects, uses, protects, and handles your information when you use our platform."
      lastUpdated={lastUpdated}
      toc={TOC}
    >
      {/* 1. Introduction */}
      <section id="introduction" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          1. Introduction
        </h2>
        <p>
          PharmaAI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to respecting and protecting your privacy. This Privacy Policy explains our practices regarding the collection, storage, security, and usage of personal and health-related data collected when you use our web application, mobile PWA, and associated AI tools.
        </p>
      </section>

      {/* 2. Information We Collect */}
      <section id="information-collected" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          2. Information We Collect
        </h2>
        <p className="mb-3">
          We only collect data necessary to provide and improve platform functionality. Categories of data collected include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><strong>Account Data:</strong> Full name, email address, password hash, and selected user role (Patient or Pharmacy Student).</li>
          <li><strong>Medication Data:</strong> Medicine names, dosage forms, strengths, instructions, frequencies, and next scheduled doses added to your inventory.</li>
          <li><strong>Schedules & Reminders:</strong> Reminder times, dose status (taken, pending, skipped, snoozed), and adherence logs.</li>
          <li><strong>Scanned Content:</strong> Photograph uploads of medicine packaging and prescriptions processed for OCR text extraction.</li>
          <li><strong>AI Assistant Conversations:</strong> Questions, prompt queries, and interaction context sent to the AI assistant.</li>
          <li><strong>Notification Tokens:</strong> Web push device tokens (via Firebase Cloud Messaging) to deliver notification alerts.</li>
          <li><strong>Technical Metadata:</strong> User agent strings, basic browser specs, and session token cookies.</li>
        </ul>
      </section>

      {/* 3. How We Use Information */}
      <section id="how-we-use" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          3. How We Use Information
        </h2>
        <p className="mb-3">We process collected data exclusively for functional operational purposes:</p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li>To authenticate users and secure private account access.</li>
          <li>To store and render your personal medicine inventory and schedule.</li>
          <li>To calculate adherence metrics and display weekly progress graphs.</li>
          <li>To send push reminder alerts to your browser or device.</li>
          <li>To analyze medicine photographs via OCR and return formatted drug data.</li>
          <li>To power AI assistant conversations tailored for patients or pharmacy students.</li>
          <li>To ensure platform security and prevent unauthorized access.</li>
        </ul>
      </section>

      {/* 4. Authentication Services */}
      <section id="authentication" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)] flex items-center gap-2">
          <Key className="text-[var(--color-primary)]" size={20} />
          4. Authentication Services
        </h2>
        <p>
          User signup, login, and session management are provided securely through <strong>Supabase Auth</strong>. For users choosing social login, authentication is performed via official <strong>Google OAuth</strong> protocols. We do not store raw password strings; authentication relies on encrypted password hashing handled by Supabase infrastructure.
        </p>
      </section>

      {/* 5. Database & Security Controls */}
      <section id="database-rls" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)] flex items-center gap-2">
          <Database className="text-[var(--color-primary)]" size={20} />
          5. Database & Row Level Security (RLS)
        </h2>
        <p className="mb-3">
          Your profile, medication records, reminders, and adherence logs are stored in a <strong>Supabase PostgreSQL database</strong>. Access is restricted using strict <strong>Row Level Security (RLS)</strong> policies:
        </p>
        <div className="bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] p-4 rounded-xl text-xs md:text-sm font-mono text-[var(--color-primary-dark)]">
          SELECT / INSERT / UPDATE / DELETE USING (auth.uid() = user_id);
        </div>
        <p className="mt-3 text-sm">
          This cryptographic policy enforces that database rows can only be accessed or modified by the specific authenticated user holding the matching User ID (`uid`).
        </p>
      </section>

      {/* 6. Push Notifications (FCM) */}
      <section id="push-notifications" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)] flex items-center gap-2">
          <Bell className="text-[var(--color-primary)]" size={20} />
          6. Firebase Cloud Messaging (FCM) Notifications
        </h2>
        <p>
          If you opt-in to enable browser medication reminders, your browser generates a web push notification token via <strong>Firebase Cloud Messaging (FCM)</strong>. This token is securely stored in your user profile table to allow our service worker to deliver scheduled alerts. You can revoke notification permissions at any time in your browser settings.
        </p>
      </section>

      {/* 7. AI Data & Conversations */}
      <section id="ai-data" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)] flex items-center gap-2">
          <Cpu className="text-[var(--color-primary)]" size={20} />
          7. AI Conversations & Prompts
        </h2>
        <p>
          Questions submitted to the AI Assistant are transmitted securely to Google Gemini API endpoints to generate explanations, drug interaction breakdowns, or quiz feedback. Prompts are processed statelessly for response generation. We advise users not to include sensitive personally identifiable information (such as full medical records, social security numbers, or addresses) directly inside chat prompt queries.
        </p>
      </section>

      {/* 8. OCR & Uploaded Images */}
      <section id="ocr-images" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)] flex items-center gap-2">
          <ImageIcon className="text-[var(--color-primary)]" size={20} />
          8. OCR & Uploaded Images
        </h2>
        <p>
          Photographs uploaded via the Medicine Scanner or Prescription Scanner are transmitted securely to server route handlers for vision analysis. Extracted medicine text is stored in your personal database inventory. Uploaded images stored in Supabase storage buckets are protected by user-specific folder RLS rules.
        </p>
      </section>

      {/* 9. Cookies & Sessions */}
      <section id="cookies-sessions" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          9. Cookies & Session Management
        </h2>
        <p>
          PharmaAI uses essential session cookies (`@supabase/ssr`) and local storage items (`pharmaai_auth`, `pharmaai_role`) strictly to maintain your authenticated login state and preserve active user preferences across page navigation. We do not use third-party tracking cookies or advertising pixels.
        </p>
      </section>

      {/* 10. Data Security */}
      <section id="data-security" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)] flex items-center gap-2">
          <Lock className="text-[var(--color-primary)]" size={20} />
          10. Data Security Practices
        </h2>
        <p>
          We employ industry-standard technical safeguards to protect your information, including HTTPS / TLS transport encryption, hashed password authentication, Supabase Row Level Security, and restricted server endpoints. While we maintain rigorous safeguards, no digital storage mechanism is 100% immune to potential risks.
        </p>
      </section>

      {/* 11. Data Sharing & Third-Party Service Providers */}
      <section id="data-sharing" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          11. Third-Party Service Providers
        </h2>
        <p className="mb-3">
          We do not sell, rent, or trade your personal data. Data is processed only by necessary service providers essential to app operation:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li><strong>Supabase:</strong> Hosting authentication services and PostgreSQL database infrastructure.</li>
          <li><strong>Google APIs (OAuth & Gemini):</strong> User sign-in authentication & generative AI synthesis.</li>
          <li><strong>Firebase (Google Cloud):</strong> PWA push notification alert delivery.</li>
        </ul>
      </section>

      {/* 12. Data Retention & Storage */}
      <section id="data-retention" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          12. Data Retention & Storage
        </h2>
        <p>
          Your medication records, schedule history, and account settings remain stored securely in your database account as long as your account remains active. If you delete your account or specific medication records, the corresponding database rows are removed permanently.
        </p>
      </section>

      {/* 13. Your Rights & Controls */}
      <section id="user-rights" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          13. Your Rights & Controls
        </h2>
        <p className="mb-3">You maintain control over your personal information:</p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li><strong>Access & Update:</strong> View and edit your full name and mode selection on the Profile page.</li>
          <li><strong>Data Deletion:</strong> Delete individual medicines, reminders, or your entire account from account settings.</li>
          <li><strong>Notification Opt-Out:</strong> Disable notification permissions at any time in your browser settings.</li>
        </ul>
      </section>

      {/* 14. Children's Privacy */}
      <section id="children-privacy" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          14. Children&apos;s Privacy
        </h2>
        <p>
          PharmaAI is designed for general adult users, patients, and pharmacy students. We do not knowingly collect personal data from children under 13 years of age. If you believe a minor has provided account data without parental consent, please contact us for account removal.
        </p>
      </section>

      {/* 15. Policy Changes */}
      <section id="policy-changes" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          15. Changes to This Privacy Policy
        </h2>
        <p>
          We may update this Privacy Policy periodically to reflect platform updates or legal requirements. Material updates will be posted on this page with a revised &quot;Last Updated&quot; timestamp.
        </p>
      </section>

      {/* 16. Contact Privacy Team */}
      <section id="contact-privacy" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          16. Contact Privacy Team
        </h2>
        <p className="mb-2">
          If you have questions, concerns, or requests regarding this Privacy Policy, please contact our team:
        </p>
        <div className="bg-[var(--color-surface-alt)] p-4 rounded-xl text-sm font-medium">
          <p>📧 Email: <a href="mailto:privacy@pharmaai.app" className="text-[var(--color-primary)] font-semibold">privacy@pharmaai.app</a></p>
          <p className="mt-1">🌐 Support: <a href="https://pharmaai.app" className="text-[var(--color-primary)] font-semibold">https://pharmaai.app</a></p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
