import { createContext, useState } from "react";
import axios from "axios";

// Create Context
export const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {

  const BACKEND_URL = "http://localhost:5000/auth"
  
  // SignUp content start from there
  const [SignupPhone, setSignupPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [LoginPhone, setLoginPhone] = useState("")
  const [ForgetPhone,setForgetPhone] = useState("")
  const [OTP, SetOTP] = useState("")

  // signUp content ends here
  

  const sendOtp = async (phonenumber) => {
    const response = await axios.post(`${BACKEND_URL}/send-otp`, { mobile:phonenumber });
    return response.data

  };

  const sendForgotPasswordOtp = async (phonenumber) => {
    const response = await axios.post(`${BACKEND_URL}/forgot-password/sendOtp`, { mobile:phonenumber });
    return response.data
  }

  const Updatepassword = async(mobile,oldPassword,newPassword) =>{
    try {
      const response = await axios.post(`${BACKEND_URL}/change-password`, { mobile, oldPassword, newPassword });
      return response.data; 
    } catch (error) {
      console.error("Password Update Error:", error);
      return { error: error.response?.data?.message || "Password update failed" };
    }
  }


  const verifyOtp = async (mobile, otp) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/verify-otp`, { mobile, otp });
      return response.data; 
    } catch (error) {
      console.error("OTP Verification Error:", error);
      return { error: error.response?.data?.message || "OTP verification failed" };
    }
  };

  const setPasswordHandler = async (mobile,password) => {
    await axios.post(`${BACKEND_URL}/set-password`, { mobile, password });
    alert("Signup complete! Now you can login");
  };


  const login = async (mobile, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, { mobile, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login succesfull! Welcome to Dashboard.");
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const handleGoogleSuccess = async(credentialResponse) => {
    
    console.log(credentialResponse);

    const tokenId = credentialResponse.credential; 

    if (!tokenId) {
      alert("Google authentication failed!");
      return;
    }

    const response = await axios.post(`${BACKEND_URL}/google-login`, { tokenId });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      alert("Login succesfull! Welcome to Dashboard.");
      window.location.href = "/";
      return { success: true, message: response.data.message };
    }
    
  }

  const logout = () => {
    localStorage.removeItem("token"); // Remove token from storage
  };
  

  return (
    <UserContext.Provider value={{  SignupPhone, setSignupPhone ,OTP,SetOTP,LoginPhone,setLoginPhone,confirmPassword,setConfirmPassword,sendOtp,verifyOtp,setPasswordHandler,login,logout,handleGoogleSuccess,ForgetPhone,setForgetPhone,sendForgotPasswordOtp,Updatepassword}}>
      {children}
    </UserContext.Provider>
  );
};
