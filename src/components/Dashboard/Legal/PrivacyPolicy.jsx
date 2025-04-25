import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <div className="bg-blue-800 bg-opacity-30 rounded-lg p-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p>Add privacy policy content here...</p>
          
          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <p>Add information usage details here...</p>
          
          {/* Add more sections as needed */}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;