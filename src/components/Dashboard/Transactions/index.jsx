import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../Context/UserContext";
import Navbar from "../Navbar/Navbar";
import { toast } from "react-toastify";

const Transactions = () => {
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.transactions) {
      setTransactions(user.transactions);
    }
    setIsLoading(false);
  }, [user]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionTypeColor = (type) => {
    if (!type) return "text-gray-400";

    switch (type.toLowerCase()) {
      case "buy":
        return "text-green-400";
      case "sell":
        return "text-red-400";
      case "deposit":
        return "text-blue-400";
      case "withdraw":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getTransactionAmountColor = (type, amount) => {
    if (!type) return "text-gray-400";

    if (type.toLowerCase() === "buy" || type.toLowerCase() === "withdraw") {
      return "text-red-400";
    }
    return "text-green-400";
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white p-4">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="mt-7 text-3xl font-bold mb-8 text-center">
            Transaction History
          </h1>

          <div className="bg-[#002865]/20 rounded-xl border-2 border-blue-500/50 overflow-hidden">
            {transactions && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-blue-500/50">
                      <th className="px-6 py-4 text-left text-lg font-semibold">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-lg font-semibold">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-lg font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-lg font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr
                        key={transaction._id || index}
                        className="border-b border-blue-500/20 hover:bg-blue-500/10 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-gray-300">
                              {transaction.description ||
                                `${transaction.type || "Transaction"}`}
                            </p>
                            {transaction.OID && (
                              <p className="text-gray-400 text-sm">
                                Order ID: {transaction.OID}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {formatDate(
                            transaction.timestamp || transaction.time
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {transaction.status && (
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                transaction.status === "SUCCESS"
                                  ? "bg-green-500/20 text-green-400"
                                  : transaction.status === "PENDING"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`text-xl font-bold ${getTransactionAmountColor(
                              transaction.type,
                              transaction.amount
                            )}`}
                          >
                            ₹{(transaction.amount || 0).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-xl">
                  No transactions to display
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Transactions;
