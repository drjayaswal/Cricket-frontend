import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/UserContext';
import { toast } from "react-toastify";

const ForgetVerifyOtp = () => {

    const {verifyOtp,ForgetPhone} = useContext(UserContext)

    const {error,setError} = useState("")
    const navigate = useNavigate()
    const [OTP,setOTP] = useState("")

    const handleVerifyOTP = async () => {
        if (!OTP) {
          toast.info("Please enter OTP");
          setError("Please enter OTP")
          return;
        }
      
        try {
          const response = await verifyOtp(ForgetPhone, OTP);
      
          if (response?.message === "OTP verified successfully") {
            toast.success("OTP verified successfully!");  
            navigate("/forgot-password/changePass"); 
          } else {
            toast.error(response?.error || "OTP verification failed. Please try again.");
          }
        } catch (error) {
          console.error("OTP Verification Error:", error);
          toast.error("Something went wrong. Please try again.");
        }
      };
    

  return (
    <>
     <div className="flex  flex-col mon-h-screen py-10 p-4 items-center justify-center ">
        <div className="w-full max-w-md space-y-10 ">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-center font-[Teko] tracking-wider text-2xl font-bold text-blue-400">
              Galaxy
            </p>
            <p className="text-center text-4xl font-bold text-white font-[Teko] tracking-wider">
             Verify Your OTP
            </p>
            <p className='text-center text-gray-600'>We’ll sent a code to xxxxxx{ForgetPhone.slice(8,13)}</p>
          </div>

          {/* Form */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between gap-2 items-center">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Enter OTP*"
                    className="border-gray-700 cursor-pointer  p-4 rounded-lg text-white outline-2 outline-gray-500 w-full"
                    value={OTP}
                    onChange={(e)=>setOTP(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              className="w-full bg-[#1B8DFF] py-2 text-3xl cursor-pointer font-[Teko] tracking-wider rounded-lg text-white font-bold hover:bg-blue-600"
              onClick={handleVerifyOTP}
            >
              Submit
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
  )
}

export default ForgetVerifyOtp
