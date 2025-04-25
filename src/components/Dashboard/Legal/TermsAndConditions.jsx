import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
      <div className="bg-blue-800 bg-opacity-30 rounded-lg p-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>Add your terms and conditions content here...</p>
          
          <h2 className="text-xl font-semibold">2. User Eligibility</h2>
          <p>Add eligibility requirements here...</p>
          
          {/* Add more sections as needed */}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;