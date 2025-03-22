import { createContext, useState } from "react";

// Create Context
export const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {


  
  // SignUp content start from there
  const [SignupPhone, setSignupPhone] = useState("");
  const [LoginPhone, setLoginPhone] = useState("")
  const [OTP, SetOTP] = useState("")



  // signUp content ends here
  return (
    <UserContext.Provider value={{  SignupPhone, setSignupPhone ,OTP,SetOTP,LoginPhone,setLoginPhone}}>
      {children}
    </UserContext.Provider>
  );
};
