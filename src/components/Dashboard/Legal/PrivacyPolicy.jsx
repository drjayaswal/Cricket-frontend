import React from "react";
import Navbar from "../Navbar/Navbar";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white p-4 md:p-8">
        <div className="mt-5 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Privacy Policy
          </h1>

          <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl space-y-8">
            {/* Last Updated */}
            <div className="flex justify-between items-center border-b border-blue-700/50 pb-4">
              <p className="text-gray-400 text-sm">
                Last Updated: April 26, 2025
              </p>
              <p className="text-gray-400 text-sm">Version 1.0</p>
            </div>

            {/* Introduction */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">1.</span>
                Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to Galaxy Cricket. We are committed to protecting your
                personal information and your right to privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you use our platform.
              </p>
            </section>

            {/* Information Collection */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">2.</span>
                Information We Collect
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>
                  We collect several types of information for various purposes:
                </p>
                <div className="rounded-xl p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-blue-300 mb-3">
                      Personal Information
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Full name and contact details</li>
                      <li>Email address and phone number</li>
                      <li>Date of birth and gender</li>
                      <li>Government-issued ID for KYC</li>
                      <li>Banking and payment information</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-300 mb-3">
                      Usage Information
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Time and date of visits</li>
                      <li>Pages viewed and time spent</li>
                      <li>Transaction history</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Use of Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">3.</span>
                How We Use Your Information
              </h2>
              <div className=" rounded-xl p-6">
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400">•</span>
                    <span>To provide and maintain our service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400">•</span>
                    <span>To notify you about changes to our service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400">•</span>
                    <span>To provide customer support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400">•</span>
                    <span>To detect, prevent and address technical issues</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400">•</span>
                    <span>
                      To process your transactions and manage your account
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400">•</span>
                    <span>
                      To send you marketing and promotional communications (with
                      your consent)
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">4.</span>
                Data Security
              </h2>
              <div className=" rounded-xl p-6 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  We implement appropriate security measures to protect your
                  personal information. However, no method of transmission over
                  the internet is 100% secure.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400">•</span>
                    <span>Encryption of sensitive data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400">•</span>
                    <span>Regular security assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400">•</span>
                    <span>Access controls and authentication</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">5.</span>
                Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We use cookies and similar tracking technologies to track
                activity on our platform and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">6.</span>
                Third-Party Services
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We may employ third-party companies and individuals to
                facilitate our service, provide service-related services, or
                assist us in analyzing how our service is used. These third
                parties have access to your personal data only to perform these
                tasks on our behalf.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">7.</span>
                Children's Privacy
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Our service does not address anyone under the age of 18. We do
                not knowingly collect personally identifiable information from
                children under 18.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">8.</span>
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date.
              </p>
            </section>

            {/* Contact Section */}
            <section className="mt-8 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-blue-400">9.</span>
                Contact Us
              </h2>
              <p className="text-gray-300">
                If you have any questions about this Privacy Policy, please
                contact us at:
                <a
                  href="mailto:support@galaxy-cricket.com"
                  className="block mt-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  support@galaxy-cricket.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
