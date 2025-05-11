import React from "react";
import Navbar from "../Navbar/Navbar";

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white p-4 md:p-8">
        <div className="mt-5 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text">
            Terms and Conditions
          </h1>

          <div className="backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl space-y-8 border border-blue-500/20">
            {/* Last Updated Section */}
            {/* Acceptance Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Acceptance of Terms
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 bg-transparent p-6 rounded-xl hover:bg-[#1671CC]/50 transition-all">
                <p>
                  By accessing or using Galaxy Cricket, you agree to be bound by
                  these Terms and Conditions. If you disagree with any part of
                  the terms, you may not access our services.
                </p>
              </div>
            </section>

            {/* Eligibility Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                User Eligibility
              </h2>
              <div className="bg-transparent rounded-xl p-6">
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3 group hover:bg-[#1671CC]/50 p-3 rounded-lg transition-all">
                    <span className="text-blue-400 group-hover:text-blue-300">
                      •
                    </span>
                    <span>You must be at least 18 years old</span>
                  </li>
                  <li className="flex items-start gap-3 group hover:bg-[#1671CC]/50 p-3 rounded-lg transition-all">
                    <span className="text-blue-400 group-hover:text-blue-300">
                      •
                    </span>
                    <span>
                      You must be a resident of a jurisdiction where online
                      gaming is legal
                    </span>
                  </li>
                  <li className="flex items-start gap-3 group hover:bg-[#1671CC]/50 p-3 rounded-lg transition-all">
                    <span className="text-blue-400 group-hover:text-blue-300">
                      •
                    </span>
                    <span>You must complete KYC verification</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Account Rules */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Account Rules
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4 bg-transparent p-6 rounded-xl transition-all">
                <p>
                  Users are responsible for maintaining the confidentiality of
                  their account information and for all activities under their
                  account.
                </p>
                <div className="mt-4">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 group hover:bg-[#1671CC]/50 p-3 rounded-lg transition-all">
                      <span className="text-blue-400 group-hover:text-blue-300">
                        •
                      </span>
                      <span>One account per user</span>
                    </li>
                    <li className="flex items-start gap-3 group hover:bg-[#1671CC]/50 p-3 rounded-lg transition-all">
                      <span className="text-blue-400 group-hover:text-blue-300">
                        •
                      </span>
                      <span>Accurate and current information required</span>
                    </li>
                    <li className="flex items-start gap-3 group hover:bg-[#1671CC]/50 p-3 rounded-lg transition-all">
                      <span className="text-blue-400 group-hover:text-blue-300">
                        •
                      </span>
                      <span>No sharing of accounts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="mt-8 bg-transparent rounded-xl p-6 transition-all">
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-300">
                If you have any questions about these Terms, please contact us
                at:
                <a
                  href="mailto:support@galaxy-cricket.com"
                  className="mt-2 text-blue-400 transition-colors bg-blue-900/30 p-3 rounded-lg inline-block"
                >
                  support@galaxy-cricket.com
                </a>
              </p>
            </section>

            <div className="flex justify-end">
              <p className="text-blue-400 text-sm bg-blue-900/30 px-4 py-2 rounded-full">
                Last Updated: April 26, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
