import React from "react";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

function TermsConditionsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        {/* Page Header */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-xs text-gray-600">
            Effective Date: October 1, 2024
          </p>
          <h1 className="text-3xl font-bold text-black mt-2">
            Terms & Conditions
          </h1>

          {/* Introduction */}
          <p className="mt-4 text-sm text-black leading-relaxed">
            Welcome to <span className="font-semibold">ReferralWala</span>. By
            accessing and using our platform, you agree to the following Terms &
            Conditions. These govern your rights, obligations, and
            responsibilities while using our services. Please read these terms
            carefully before continuing.
          </p>

          {/* Terms Sections */}
          <div className="mt-6 space-y-6">
            {/* Section 1 - Acceptance of Terms */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">
                1. Acceptance of Terms
              </h2>
              <p className="text-sm text-black mt-1">
                By using ReferralWala, you confirm that you accept these Terms &
                Conditions and agree to comply with them. If you do not agree,
                you must stop using our platform immediately.
              </p>
            </section>

            {/* Section 2 - User Responsibilities */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">
                2. User Responsibilities
              </h2>
              <ul className="mt-2 list-disc list-inside text-sm text-black space-y-1">
                <li>
                  <strong>Account Creation:</strong> You must provide accurate
                  details and keep your account credentials secure.
                </li>
                <li>
                  <strong>Accuracy of Information:</strong> Information provided
                  for referrals, profiles, or services must be truthful.
                </li>
                <li>
                  <strong>Acceptable Use:</strong> You may only use ReferralWala
                  for legal and ethical purposes.
                </li>
                <li>
                  <strong>Prohibited Activities:</strong> Engaging in fraud,
                  hacking, or spamming is strictly forbidden.
                </li>
                <li>
                  <strong>Compliance:</strong> Users must follow all applicable
                  laws and platform policies.
                </li>
              </ul>
            </section>

            {/* Section 3 - Referrals and Rewards */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">
                3. Referrals and Rewards
              </h2>
              <ul className="mt-2 list-disc list-inside text-sm text-black space-y-1">
                <li>
                  <strong>Posting Referrals:</strong> All referrals must be
                  genuine and align with our guidelines.
                </li>
                <li>
                  <strong>Earning Rewards:</strong> Rewards depend on successful
                  referral completions and our set policies.
                </li>
                <li>
                  <strong>Referral Tracking:</strong> We track referrals
                  accurately, but issues beyond our control are not our
                  liability.
                </li>
                <li>
                  <strong>Fraud Prevention:</strong> Any attempts to game the
                  referral system will result in account suspension.
                </li>
              </ul>
            </section>

            {/* Section 4 - Intellectual Property */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">
                4. Intellectual Property
              </h2>
              <p className="text-sm text-black mt-1">
                All platform content—including logos, text, and software—belongs
                to ReferralWala and is protected under intellectual property
                laws.
              </p>
            </section>

            {/* Section 5 - Privacy & Data Protection */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">
                5. Privacy & Data Protection
              </h2>
              <p className="text-sm text-black mt-1">
                Your privacy is a priority. Please read our{" "}
                <a
                  href="/privacy-policy"
                  className="text-blue-600 font-semibold underline"
                >
                  Privacy Policy
                </a>{" "}
                to understand how we handle your data.
              </p>
            </section>

            {/* Section 6 - Refund & Cancellation Policy */}
            {/* <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">6. Refund & Cancellation Policy</h2>
              <p className="text-sm text-black mt-1">
                Users can request a refund within <strong>7 days</strong> of completing a referral transaction, subject to our refund guidelines. Refunds will be processed within <strong>5-10 business days</strong>.
              </p>
            </section> */}

            {/* Section 7 - Limitations of Liability */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">
                6. Limitations of Liability
              </h2>
              <p className="text-sm text-black mt-1">
                ReferralWala is provided "as is." We are not responsible for any
                direct or indirect damages arising from platform use.
              </p>
            </section>

            {/* Section 8 - Termination of Use */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">
                7. Termination
              </h2>
              <p className="text-sm text-black mt-1">
                We may suspend or terminate your access if you violate these
                terms. Upon termination, you must cease all use of the platform.
              </p>
            </section>

            {/* Section 9 - Dispute Resolution */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">
                8. Dispute Resolution
              </h2>
              <p className="text-sm text-black mt-1">
                Any disputes arising from these Terms will be resolved through
                mediation.
              </p>
            </section>

            {/* Section 10 - Changes to Terms */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">
                9. Changes to Terms
              </h2>
              <p className="text-sm text-black mt-1">
                We may modify these Terms & Conditions periodically. Any updates
                will be posted, and continued use implies acceptance.
              </p>
            </section>

            {/* Section 11 - Contact Information */}
            <section className="p-4 bg-gray-50 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-black">
                10. Contact Us
              </h2>
              <p className="text-sm text-black mt-1">
                For any questions about these Terms & Conditions, reach us at:
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-black space-y-1">
                <li>
                  <strong>Email:</strong> referralwala.tech@gmail.com
                </li>
                <li>
                  <strong>Phone:</strong> +91[7992244398]
                </li>
                {/* <li><strong>Address:</strong> [Your Business Address]</li> */}
              </ul>
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

export default TermsConditionsPage;
