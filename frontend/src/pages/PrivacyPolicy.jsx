import React from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Page Header */}
        <div className="bg-white shadow-md rounded-lg p-5">
          <p className="text-xs text-gray-600">
            Effective Date: October 1, 2024
          </p>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            Privacy Policy
          </h1>

          {/* Introduction */}
          <p className="mt-4 text-sm text-gray-900 leading-relaxed">
            Welcome to <span className="font-semibold">ReferralWala</span>. Your
            privacy is important to us. This Privacy Policy explains how we
            collect, use, and protect your personal information when you
            interact with our platform. By using ReferralWala, you agree to the
            terms outlined below.
          </p>

          {/* Privacy Sections */}
          <div className="mt-6 space-y-6">
            {/* Section 1 - Information We Collect */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                1. Information We Collect
              </h2>
              <p className="text-sm text-gray-900 mt-1">
                We collect various types of data to improve our services:
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-900 space-y-1">
                <li>
                  <strong>Personal Information:</strong> Name, email, phone
                  number, and account details.
                </li>
                <li>
                  <strong>Referral Data:</strong> Contact details and referral
                  information shared through the platform.
                </li>
                <li>
                  <strong>Transaction Data:</strong> Payment details, rewards,
                  and payout history.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type,
                  device information, and website analytics.
                </li>
                <li>
                  <strong>Cookies & Tracking:</strong> Data collected via
                  cookies to improve site functionality.
                </li>
              </ul>
            </section>

            {/* Section 2 - How We Use Your Information */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                2. How We Use Your Information
              </h2>
              <p className="text-sm text-gray-900 mt-1">
                Your information is used for the following purposes:
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-900 space-y-1">
                <li>
                  <strong>Providing Services:</strong> Facilitating referrals,
                  tracking rewards, and managing accounts.
                </li>
                <li>
                  <strong>Customer Support:</strong> Assisting with queries and
                  resolving issues.
                </li>
                <li>
                  <strong>Platform Improvement:</strong> Enhancing features
                  based on usage trends.
                </li>
                <li>
                  <strong>Legal Compliance:</strong> Ensuring adherence to
                  applicable laws and regulations.
                </li>
                <li>
                  <strong>Marketing (Opt-in Only):</strong> Sending updates,
                  promotions, and offers.
                </li>
              </ul>
            </section>

            {/* Section 3 - Data Sharing */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                3. Data Sharing
              </h2>
              <p className="text-sm text-gray-900 mt-1">
                We do not sell your personal information. However, we may share
                data in the following situations:
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-900 space-y-1">
                <li>
                  <strong>With Referral Partners:</strong> To facilitate the
                  referral process.
                </li>
                <li>
                  <strong>With Service Providers:</strong> Such as payment
                  processors, hosting services, and analytics tools.
                </li>
                <li>
                  <strong>For Legal Reasons:</strong> In response to law
                  enforcement requests or to prevent fraud.
                </li>
              </ul>
            </section>

            {/* Section 4 - Data Security */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                4. Data Security
              </h2>
              <p className="text-sm text-gray-900 mt-1">
                We implement industry-standard security measures, including
                encryption, access controls, and secure storage, to protect your
                data. However, no system is entirely foolproof. Please use
                strong passwords and avoid sharing account credentials.
              </p>
            </section>

            {/* Section 5 - Data Retention */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                5. Data Retention
              </h2>
              <p className="text-sm text-gray-900 mt-1">
                We retain your data for as long as necessary to fulfill the
                purposes outlined in this policy. If you wish to delete your
                data, contact us at{" "}
                <span className="font-semibold">
                  referralwala.tech@gmail.com
                </span>
                . Some legal requirements may require longer retention.
              </p>
            </section>

            {/* Section 6 - User Rights */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                6. Your Rights
              </h2>
              <p className="text-sm text-gray-900 mt-1">
                You may have the following rights depending on applicable laws:
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-gray-900 space-y-1">
                <li>
                  <strong>Access:</strong> Request a copy of your data.
                </li>
                <li>
                  <strong>Correction:</strong> Update incorrect or incomplete
                  information.
                </li>
                <li>
                  <strong>Deletion:</strong> Request data removal (subject to
                  legal obligations).
                </li>
                <li>
                  <strong>Restriction:</strong> Limit how we process your data.
                </li>
                <li>
                  <strong>Objection:</strong> Opt-out of certain processing
                  activities.
                </li>
              </ul>
              <p className="mt-2 text-xs text-gray-700">
                To exercise these rights, email us at{" "}
                <span className="font-semibold">[Your Contact Email]</span>.
              </p>
            </section>

            {/* Section 7 - Cookies & Tracking */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                7. Cookies and Tracking
              </h2>
              <p className="text-sm text-gray-900 mt-1">
                We use cookies to enhance user experience. You can manage cookie
                settings in your browser.
              </p>
            </section>

            {/* Section 8 - Policy Updates */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900">
                8. Changes to This Policy
              </h2>
              <p className="text-sm text-gray-900 mt-1">
                This Privacy Policy may be updated periodically. Any significant
                changes will be communicated via email or platform
                notifications.
              </p>
            </section>
          </div>

          {/* Contact Button */}
          {/* <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/contact")}
              className="bg-blue-700 text-white px-5 py-2 rounded shadow-md hover:bg-gray-800 transition-all text-sm"
            >
              Contact Us
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
