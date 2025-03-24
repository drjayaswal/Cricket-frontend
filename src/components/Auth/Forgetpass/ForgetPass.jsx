import React, { useContext, useState } from 'react'
import { UserContext } from '../../../Context/UserContext'
import { useNavigate } from 'react-router-dom'

const ForgetPass = () => {

  const {ForgetPhone,setForgetPhone,sendForgotPasswordOtp} = useContext(UserContext)
  const [error,setError] = useState("")

  const navigate = useNavigate()

  const handleForgotPasswordOtp = async (e) => {
    e.preventDefault();

  
    let phoneNumber = ForgetPhone.trim();
  
    // Remove spaces, dashes, or non-numeric characters
    phoneNumber = phoneNumber.replace(/\D/g, "");
  
    // Ensure it starts with +91
    if (!phoneNumber.startsWith("91")) {
      phoneNumber = `91${phoneNumber}`;
    }
    
    phoneNumber = `+${phoneNumber}`;
  
    // Validate Indian phone number
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Invalid phone number. Must be a valid Indian number (+91XXXXXXXXXX).");
      return;
    }
  
    setForgetPhone(phoneNumber);
    setError("");
  
    try {
      const response = await sendForgotPasswordOtp(phoneNumber);
  
      if (response?.message === "OTP sent successfully for password reset") {
        alert(response?.message);
        navigate("/forgot-password/verify-password"); // Navigate to OTP verification page
      } else if (response?.message === "User not found") {
        alert("No account found with this phone number. Please register first.");
        navigate("/"); 
      } else {
        alert(response?.error || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.log(error,"koi or dikkat hai");
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
             Forget Password
            </p>
            <p className='text-center text-gray-600'>We’ll send you a OTP for verification</p>
          </div>

          {/* Form */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex justify-between gap-2 items-center">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Mobile number*"
                    className="border-gray-700 cursor-pointer  p-4 rounded-lg text-white outline-2 outline-gray-500 w-full"
                    value={ForgetPhone}
                    onChange={(e)=>setForgetPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              className="w-full bg-[#1B8DFF] py-2 text-3xl cursor-pointer font-[Teko] tracking-wider rounded-lg text-white font-bold hover:bg-blue-600"
              onClick={handleForgotPasswordOtp}
            >
              Continue
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

export default ForgetPass
