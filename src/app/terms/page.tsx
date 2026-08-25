"use client";

import React from "react";
import { LegalPageLayout } from "@/components/shared/LegalPageLayout";
import { AlertTriangle } from "lucide-react";

const TOC = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "about", title: "About PharmaAI" },
  { id: "medical-disclaimer", title: "Medical Disclaimer" },
  { id: "user-accounts", title: "User Accounts" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "medication-info", title: "Medication Information" },
  { id: "ai-assistant", title: "AI Assistant Guidance" },
  { id: "ocr-scanning", title: "OCR / Image Scanning" },
  { id: "notifications", title: "Notifications & Reminders" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "availability", title: "Service Availability" },
  { id: "termination", title: "Account Termination" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Information" },
];

export default function TermsPage() {
  const lastUpdated = "24 August 2026";

  return (
    <LegalPageLayout
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using the PharmaAI smart pharmacy platform."
      lastUpdated={lastUpdated}
      toc={TOC}
    >
      {/* 1. Acceptance of Terms */}
      <section id="acceptance" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing, registering for, or using the PharmaAI web application and related services (collectively, &quot;PharmaAI&quot;), you confirm that you have read, understood, and agreed to be bound by these Terms & Conditions (&quot;Terms&quot;). If you do not agree to these Terms, you must immediately cease accessing or using the platform.
        </p>
      </section>

      {/* 2. About PharmaAI */}
      <section id="about" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          2. About PharmaAI
        </h2>
        <p className="mb-3">
          PharmaAI is an AI-powered digital healthcare and medication management ecosystem designed to assist users in organizing and understanding their medications. Platform features currently implemented include:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li>Medication inventory tracking & schedule management</li>
          <li>Medication reminder notifications</li>
          <li>Prescription & medicine OCR image scanning</li>
          <li>Generic alternative and pricing comparison tools</li>
          <li>AI-powered health assistant for patients</li>
          <li>AI-powered study hub, drug mechanisms, and quizzes for pharmacy students</li>
          <li>Medication adherence tracking & visual logs</li>
        </ul>
      </section>

      {/* 3. Medical Disclaimer */}
      <section id="medical-disclaimer" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)] flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={20} />
          3. Medical Disclaimer
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 sm:p-4 mb-4 text-amber-900 text-xs sm:text-sm leading-relaxed min-w-0 break-words [overflow-wrap:anywhere]">
          <p className="font-bold mb-1">IMPORTANT NOTICE:</p>
          PharmaAI is NOT a licensed medical doctor, hospital, pharmacy, or emergency healthcare provider. The content, outputs, reminders, and AI responses provided by PharmaAI are for informational and educational purposes only and MUST NOT be construed as professional medical advice, diagnosis, treatment, or formal prescription.
        </div>
        <p className="mb-3">
          Always seek the direct advice of your physician, licensed pharmacist, or other qualified healthcare provider regarding any medical condition, dosage, side effect, or treatment plan. Never disregard professional medical advice or delay seeking it because of information accessed on PharmaAI.
        </p>
        <p className="font-semibold text-red-600 text-xs sm:text-sm break-words">
          🚨 IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, IMMEDIATELY CALL YOUR LOCAL EMERGENCY SERVICES (E.G., 911 OR 112) OR PROCEED TO THE NEAREST EMERGENCY ROOM.
        </p>
      </section>

      {/* 4. User Accounts */}
      <section id="user-accounts" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          4. User Accounts
        </h2>
        <p className="mb-3">
          To access personalized medication management and student study features, you must create a user account. You agree to:
        </p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm min-w-0 break-words [overflow-wrap:anywhere]">
          <li>Provide accurate, current, and complete registration information.</li>
          <li>Maintain the security of your password and credentials.</li>
          <li>Promptly update your profile information if changes occur.</li>
          <li>Accept responsibility for all activities that occur under your account credentials.</li>
        </ul>
      </section>

      {/* 5. Acceptable Use */}
      <section id="acceptable-use" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          5. Acceptable Use
        </h2>
        <p className="mb-3">When using PharmaAI, you agree NOT to:</p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm min-w-0 break-words [overflow-wrap:anywhere]">
          <li>Misuse or attempt to gain unauthorized access to any part of the system or database.</li>
          <li>Interfere with, disrupt, or place an unreasonable load on the servers, networks, or APIs.</li>
          <li>Upload malicious code, viruses, or harmful files.</li>
          <li>Attempt to view, alter, or access data belonging to another user.</li>
          <li>Impersonate any individual, pharmacist, healthcare provider, or entity.</li>
          <li>Use automated scrapers or bots without explicit prior permission.</li>
        </ul>
      </section>

      {/* 6. Medication Information */}
      <section id="medication-info" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          6. Medication Information
        </h2>
        <p>
          Drug information, dosages, side effects, interactions, and generic comparisons rendered in PharmaAI originate from public healthcare databases (such as OpenFDA) and AI reference models. While we strive to maintain accurate reference information, drug data is dynamic and subject to updates. You agree to independently verify critical drug details with your doctor or pharmacist prior to taking any medication.
        </p>
      </section>

      {/* 7. AI Assistant Guidance */}
      <section id="ai-assistant" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          7. AI Assistant Guidance
        </h2>
        <p className="mb-3">
          PharmaAI incorporates automated generative Artificial Intelligence (powered by Google Gemini APIs) to assist patients with drug explanations and support pharmacy students with pharmacology concepts.
        </p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm min-w-0 break-words [overflow-wrap:anywhere]">
          <li>AI responses are generated dynamically and may contain errors, omissions, or inaccuracies.</li>
          <li>The AI Assistant cannot perform physical examinations, diagnose illnesses, or issue prescriptions.</li>
          <li>You must independently evaluate and verify any information generated by the AI Assistant before taking medical action.</li>
        </ul>
      </section>

      {/* 8. OCR / Image Scanning */}
      <section id="ocr-scanning" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          8. OCR / Image Scanning Technology
        </h2>
        <p>
          Our medicine image recognition and prescription OCR features process photograph inputs to extract text automatically. Due to lighting variations, handwriting differences, or packaging designs, scanning models may occasionally misread medication names, strengths, or dosages. You are solely responsible for reviewing and confirming extracted schedule data against your physical prescription label.
        </p>
      </section>

      {/* 9. Notifications & Reminders */}
      <section id="notifications" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          9. Notifications & Reminders
        </h2>
        <p>
          Medication reminders and web push notifications delivered via Firebase Cloud Messaging (FCM) are provided as auxiliary convenience tools. Notification delivery depends on external factors including device settings, operating system background execution limits, and network connectivity. PharmaAI does not guarantee uninterrupted delivery of every push alert; you remain responsible for maintaining your medication schedule.
        </p>
      </section>

      {/* 10. Intellectual Property */}
      <section id="intellectual-property" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          10. Intellectual Property
        </h2>
        <p>
          All trademarks, logos, UI designs, graphics, branding, software code, and proprietary content associated with PharmaAI are the property of PharmaAI. You are granted a personal, non-exclusive, non-transferable, revocable license to access the platform for personal, non-commercial use.
        </p>
      </section>

      {/* 11. Third-Party Services */}
      <section id="third-party" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          11. Third-Party Integration Services
        </h2>
        <p className="mb-3">PharmaAI relies on trusted third-party infrastructure providers to supply core platform functionality:</p>
        <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm min-w-0 break-words [overflow-wrap:anywhere]">
          <li><strong>Supabase Auth & Database:</strong> User authentication, secure database storage, and Row Level Security.</li>
          <li><strong>Google OAuth:</strong> Social sign-in authentication.</li>
          <li><strong>Google Gemini API:</strong> Generative AI assistance, drug mechanism synthesis, and vision analysis.</li>
          <li><strong>Firebase Cloud Messaging (FCM):</strong> Browser push notification delivery.</li>
          <li><strong>OpenFDA API:</strong> Public drug label information and active ingredient datasets.</li>
        </ul>
      </section>

      {/* 12. Service Availability */}
      <section id="availability" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          12. Service Availability
        </h2>
        <p>
          We continuously optimize platform stability, but PharmaAI may experience routine maintenance, updates, technical glitches, or third-party service outages. We do not guarantee uninterrupted access or zero downtime.
        </p>
      </section>

      {/* 13. Account Termination */}
      <section id="termination" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          13. Account Termination & Deletion
        </h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms or engage in abusive activity. You may also delete your profile and associated data at any time via your account settings page.
        </p>
      </section>

      {/* 14. Limitation of Liability */}
      <section id="liability" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          14. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by applicable law, PharmaAI and its developers shall not be liable for any direct, indirect, incidental, consequential, or punitive damages resulting from your use of, or inability to use, the platform, medication reminders, AI outputs, or OCR scanning features.
        </p>
      </section>

      {/* 15. Changes to Terms */}
      <section id="changes" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          15. Changes to Terms
        </h2>
        <p>
          We may modify or update these Terms periodically. Revised terms will be posted directly on this page with an updated &quot;Last Updated&quot; timestamp. Continued use of PharmaAI after updates signifies acceptance of the revised Terms.
        </p>
      </section>

      {/* 16. Contact Information */}
      <section id="contact" className="scroll-mt-24">
        <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-3 pb-2 border-b border-[var(--color-border-light)]">
          16. Contact Information
        </h2>
        <p className="mb-2">
          If you have any questions or feedback regarding these Terms & Conditions, please contact us:
        </p>
        <div className="bg-[var(--color-surface-alt)] p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm font-medium min-w-0 break-words [overflow-wrap:anywhere]">
          <p>📧 Email: <a href="mailto:support@pharmaai.app" className="text-[var(--color-primary)] font-semibold break-all">support@pharmaai.app</a></p>
          <p className="mt-1">🌐 Website: <a href="https://pharmaai.app" className="text-[var(--color-primary)] font-semibold break-all">https://pharmaai.app</a></p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
