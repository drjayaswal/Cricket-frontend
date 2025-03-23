import { createContext, useState } from "react";
import axios from "axios";

// Create Context
export const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {

  
  // SignUp content start from there
  const [SignupPhone, setSignupPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [LoginPhone, setLoginPhone] = useState("")
  const [OTP, SetOTP] = useState("")

  // signUp content ends here
  

  const sendOtp = async (phonenumber) => {
    const response = await axios.post("http://localhost:5000/auth/send-otp", { mobile:phonenumber });
    return response.data

  };

  const verifyOtp = async (mobile, otp) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/verify-otp", { mobile, otp });
      return response.data; 
    } catch (error) {
      console.error("OTP Verification Error:", error);
      return { error: error.response?.data?.message || "OTP verification failed" };
    }
  };

  const setPasswordHandler = async (mobile,password) => {
    await axios.post("http://localhost:5000/auth/set-password", { mobile, password });
    alert("Signup complete! Welcome to Dashboard.");
  };


  const login = async (mobile, password) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", { mobile, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login succesfull! Welcome to Dashboard.");
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token from storage
  };
  

  return (
    <UserContext.Provider value={{  SignupPhone, setSignupPhone ,OTP,SetOTP,LoginPhone,setLoginPhone,confirmPassword,setConfirmPassword,sendOtp,verifyOtp,setPasswordHandler,login,logout}}>
      {children}
    </UserContext.Provider>
  );
};
