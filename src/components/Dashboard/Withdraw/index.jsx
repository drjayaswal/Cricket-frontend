import React from 'react';

const Withdraw = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Withdraw Funds</h1>
      <div className="bg-blue-800 bg-opacity-30 rounded-lg p-4">
        <form className="space-y-4">
          <div>
            <label className="block mb-2">Amount</label>
            <input 
              type="number" 
              className="w-full p-2 rounded bg-blue-700 bg-opacity-50"
              placeholder="Enter amount"
            />
          </div>
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
            type="submit"
          >
            Withdraw
          </button>
        </form>
      </div>
    </div>
  );
};

export default Withdraw;