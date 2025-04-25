import React from 'react';

const InviteFriends = () => {
  const referralCode = "USER123"; // Replace with actual referral code

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Invite Friends</h1>
      <div className="bg-blue-800 bg-opacity-30 rounded-lg p-4">
        <div className="text-center">
          <h2 className="text-xl mb-2">Your Referral Code</h2>
          <div className="bg-blue-700 bg-opacity-50 p-4 rounded mb-4">
            <code className="text-xl">{referralCode}</code>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
            onClick={() => navigator.clipboard.writeText(referralCode)}
          >
            Copy Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteFriends;