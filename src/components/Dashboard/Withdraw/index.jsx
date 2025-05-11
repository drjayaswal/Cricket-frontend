import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../Context/UserContext.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar.jsx";

const Withdraw = () => {
  const { user } = useContext(UserContext);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLimitUpper] = useState(10000);
  const [withdrawLimitLower] = useState(1000);
  const [withdrawHistory] = useState(user.transactions);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > withdrawLimitUpper) {
      toast.error(
        `Maximum withdrawal limit is ₹${withdrawLimitUpper.toLocaleString()}`
      );
      return;
    }
    if (amount < withdrawLimitLower) {
      toast.error(
        `Minimum withdrawal limit is ₹${withdrawLimitLower.toLocaleString()}`
      );
      return;
    }

    if (amount > user.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Processing withdrawal...");

    try {
      // TODO: Add your API call here
      // await withdrawFunds(amount);

      toast.update(toastId, {
        render: "Withdrawal successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setWithdrawAmount("");
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Failed to process withdrawal",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(withdrawHistory);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#001d4f] to-[#002865] text-white p-4 md:p-8 animate-fadeIn">
        <div className="max-w-4xl mx-auto">
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center bg-clip-text text-white animate-slideDown">
            Withdraw Funds
          </h1>

          {/* Balance Card */}
          <div className="bg-[#001d4f]/30 backdrop-blur-sm rounded-2xl p-8 -mb-10 transform hover:scale-[1.02] transition-all duration-300 animate-slideUp">
            <div className="text-center">
              <p className="text-gray-300 text-2xl mb-3">Available Balance</p>
              <p
                className={`text-7xl font-bold ${
                  user.amount > 0 ? "text-green-600" : "text-[#1671cc]"
                } mb-2`}
              >
                ₹{user.amount?.toLocaleString() || "0"}
              </p>
            </div>
          </div>

          {/* Withdraw Form */}
          <div className="rounded-2xl p-6 md:p-8 transform transition-all duration-300 animate-slideUp delay-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="relative">
                <div className="pt-6">
                  <div className="relative group">
                    <div className="relative">
                      <div className="flex items-center">
                        <span className="absolute left-4 text-2xl text-white/70">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full p-4 pl-12 rounded-lg bg-[#002865]/30 border-2 border-[#1671cc]/30 
                          focus:outline-none focus:border-[#1671cc] text-2xl text-white
                          transition-all duration-200 placeholder:text-white/30"
                          placeholder="Enter amount"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center px-2">
                    <button
                      type="button"
                      onClick={() =>
                        setWithdrawAmount(withdrawLimitLower.toString())
                      }
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      Min: ₹{withdrawLimitLower.toLocaleString()}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setWithdrawAmount(withdrawLimitUpper.toString())
                      }
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      Max: ₹{withdrawLimitUpper.toLocaleString()}
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full hover:bg-[#1671cc] bg-transparent text-[#1671CC] hover:text-white font-semibold 
                  py-4 px-8 rounded-lg transform hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-300 disabled:opacity-50 text-3xl border-2 border-[#1671cc]/30
                  hover:border-[#1671cc]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Withdraw"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Withdrawal History */}
          {withdrawHistory.length > 0 && (
            <div className="mt-12 backdrop-blur-sm rounded-2xl p-8 md:p-10 animate-slideUp delay-200">
              <h2 className="text-3xl font-bold text-white/50 mb-8 text-center">
                Recent Withdrawals
              </h2>
              <div className="space-y-6 md:space-y-8">
                {withdrawHistory.map((transaction, index) => (
                  <div
                    key={transaction._id}
                    className={`flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-8 
                    rounded-xl transition-all duration-300 transform hover:scale-[1.01]
                    bg-[#002865]/20 border-2 animate-slideIn ${
                      transaction.status === "SUCCESS"
                        ? "border-green-500/50 hover:border-green-300"
                        : transaction.status === "PENDING"
                        ? "border-yellow-500/50 hover:border-yellow-300"
                        : "border-red-500/50 hover:border-red-300"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-3 mb-4 md:mb-0">
                      <p className="text-gray-300 text-xl">
                        {new Date(transaction.time).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                      <div className="space-y-1">
                        <p className="text-lg text-gray-400">
                          Order ID: {transaction.OID}
                        </p>
                      </div>
                      <span
                        className={`py-2 rounded-lg inline-block ${
                          transaction.status === "SUCCESS"
                            ? "text-green-300 text-xl"
                            : transaction.status === "PENDING"
                            ? "text-yellow-300 text-xl"
                            : "text-red-300 text-xl"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <p
                      className={`text-3xl font-bold 
                        ${
                          transaction.status === "SUCCESS"
                            ? "text-green-600"
                            : transaction.status === "PENDING"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                         `}
                    >
                      ₹{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

export default Withdraw;
