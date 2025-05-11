import React, { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import { FaIdCard, FaCreditCard } from "react-icons/fa";

const KYCVerification = () => {
  const [aadharName, setAadharName] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [panName, setPanName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!aadharName.trim()) newErrors.aadharName = "Name cannot be empty";
    if (!aadharNumber || aadharNumber.length !== 12) {
      newErrors.aadharNumber = "Valid 12-digit Aadhar number required";
    }
    if (!panName.trim()) newErrors.panName = "Name cannot be empty";
    if (!panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNumber)) {
      newErrors.panNumber = "Valid PAN number required (e.g., ABCDE1234F)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all fields correctly");
      return;
    }

    const kycData = {
      aadharName,
      aadharNumber,
      panName,
      panNumber,
    };

    try {
      // Show loading toast
      const toastId = toast.loading("Submitting KYC details...");

      // TODO: Add your API call here
      console.log("Form Data Object:", kycData);

      // Update toast on success
      toast.update(toastId, {
        render: "KYC details submitted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Failed to submit KYC details. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white p-4 md:p-8">
        <div className="mt-5 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              KYC Verification
            </h1>
            <p className="text-gray-400 text-lg">
              Please provide your Aadhar and PAN details for verification
            </p>
          </div>

          <div className="rounded-3xl">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Aadhar Card Section */}
              <div className="space-y-6 p-6 rounded-2xl border-2 border-transparent hover:border-[#1671CC] transition-all duration-200">
                <div className="flex items-center gap-3">
                  <FaIdCard className="text-2xl text-blue-400" />
                  <h2 className="text-2xl font-semibold text-blue-300">
                    Aadhar Card Details
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name as per Aadhar
                    </label>
                    <input
                      type="text"
                      className={`w-full p-3 rounded-xl bg-blue-800/30 border ${
                        errors.aadharName
                          ? "border-red-500"
                          : "border-blue-500/50"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="Enter your full name"
                      value={aadharName}
                      onChange={(e) => setAadharName(e.target.value)}
                    />
                    {errors.aadharName && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <span>⚠️</span> {errors.aadharName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Aadhar Number
                    </label>
                    <input
                      type="text"
                      className={`w-full p-3 rounded-xl bg-blue-800/30 border ${
                        errors.aadharNumber
                          ? "border-red-500"
                          : "border-blue-500/50"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="Enter 12-digit Aadhar Number"
                      value={aadharNumber.replace(/(\d{4})(?=\d)/g, "$1-")}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 12) {
                          setAadharNumber(value);
                        }
                      }}
                    />
                    {errors.aadharNumber && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <span>⚠️</span> {errors.aadharNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* PAN Card Section */}
              <div className="space-y-6 p-6 rounded-2xl border-2 border-transparent hover:border-[#1671CC] transition-all duration-200">
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-2xl text-blue-400" />
                  <h2 className="text-2xl font-semibold text-blue-300">
                    PAN Card Details
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name as per PAN
                    </label>
                    <input
                      type="text"
                      className={`w-full p-3 rounded-xl bg-blue-800/30 border ${
                        errors.panName ? "border-red-500" : "border-blue-500/50"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="Enter your full name"
                      value={panName}
                      onChange={(e) => setPanName(e.target.value)}
                    />
                    {errors.panName && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <span>⚠️</span> {errors.panName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      className={`w-full p-3 rounded-xl bg-blue-800/30 border ${
                        errors.panNumber
                          ? "border-red-500"
                          : "border-blue-500/50"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      placeholder="Enter PAN Number (e.g., ABCDE1234F)"
                      value={panNumber}
                      onChange={(e) =>
                        setPanNumber(e.target.value.toUpperCase())
                      }
                      maxLength={10}
                    />
                    {errors.panNumber && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <span>⚠️</span> {errors.panNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
                       hover:from-blue-600 hover:to-blue-700 text-white font-semibold 
                       py-4 px-8 rounded-xl transform hover:scale-[1.02] 
                       transition-all duration-300
                       flex items-center justify-center gap-2"
              >
                <span>Submit KYC Details</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default KYCVerification;
