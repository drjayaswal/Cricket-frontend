import React from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const { SignupPhone, OTP, SetOTP } = useContext(UserContext);

  // const handleNext = () => {
  //   if (OTP) {
  //     navigate("/setpassword");
  //   } else {
  //     alert("Please enter OTP");
  //     return;
  //   }
  // };
  const handleVerifyOTP = async () => {
    if (OTP) {
          navigate("/setpassword");
        } else {
          alert("Please enter OTP");
          return;
        }
  };


  useEffect(() => {
    if (!SignupPhone) {
      navigate("/");
    }
  }, [SignupPhone, navigate]);

  return (
    <>
      <div className="w-full max-w-full text-center font-[Teko] tracking-wider bg-[#1671CC] py-6 text-4xl font-bold text-white">
        Get Start
      </div>
      <div className="flex  flex-col mon-h-screen py-10 p-4 items-center justify-center ">
        <div className="w-full max-w-md space-y-10 ">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-center font-[Teko] tracking-wider text-2xl font-bold text-blue-400">
              Galaxy
            </p>
            <p
              className="text-center text-4xl font-bold text-white font-[Teko] tracking-wider"
            >
              Verify Your OTP
            </p>
          </div>

          {/* Form */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between gap-2 items-center">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Mobile number*"
                    className="border-gray-700 cursor-pointer  p-4 rounded-lg text-gray-500 outline-2 outline-gray-500 w-full"
                    value={SignupPhone}
                    disabled
                  />
                  <button
                    className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 font-semibold"
                    onClick={() => navigate(-1)}
                  >
                    Edit
                  </button>
                </div>
                <button className="text-white  bg-blue-500 p-1 cursor-pointer rounded-md ">
                  Send OTP
                </button>
              </div>

              <input
                type="text"
                placeholder="Enter OTP"
                className="border-gray-700 cursor-pointer p-4 rounded-lg text-white outline-2 outline-gray-500 w-full"
                value={OTP}
                onChange={(e) => {
                  const enteredOTP = e.target.value.replace(/\D/g, ""); // Remove non-numeric chars
                  SetOTP(enteredOTP);
                }}
              />
            </div>

            <button
              className="w-full bg-[#1B8DFF] py-2 text-3xl cursor-pointer font-[Teko] tracking-wider rounded-lg text-white font-bold hover:bg-blue-600"
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </button>
          </div>

          {/* Footer */}
          <div className="pt-4 text-center text-md text-gray-300 mt-20">
            <a href="#" className="hover:text-gray-400">
              Terms of Use
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-gray-400">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOTP;
