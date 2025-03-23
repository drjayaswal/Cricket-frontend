import React, { useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";


const SetPassword = () => {
  const { SignupPhone,setPasswordHandler,confirmPassword,setConfirmPassword } = useContext(UserContext);
  const [password, setPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!password) {
      setError("Password is required.");
      return;
    }
  
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }else{
      setError("");
      setPasswordHandler(SignupPhone,confirmPassword)
      navigate("/home")

    }

  };


  return (
    <>
      <div className="w-full max-w-full text-center font-[Teko] tracking-wider bg-[#1671CC] py-6 text-4xl font-bold text-white">
        Get Start
      </div>
      <div className="flex  flex-col mon-h-screen py-10 p-4 items-center justify-center ">
        <div className="w-full max-w-md space-y-10 ">
          {/* Header */}
          <div className="space-y-4">
            <p className="text-center text-2xl font-bold font-[Teko] tracking-wider text-blue-400">
              Galaxy
            </p>
            <h1 className="text-center text-4xl font-[Teko] tracking-wider font-bold text-white">
              Enter Your Password
            </h1>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-6">


              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password*"
                  className="border-gray-700 cursor-pointer  p-4 rounded-lg text-white outline-2 outline-gray-500 w-full"
                  value={password}
                  onChange={(e) =>  {
                    setPassword(e.target.value);
                    setError(""); // Clear error on change
                  }}
                />
                <button
                  className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 font-semibold"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                   {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon/>}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password*"
                  className="border-gray-700 cursor-pointer  p-4 rounded-lg text-white outline-2 outline-gray-500 w-full"
                  value={confirmPassword}
                  onChange={(e) =>  {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 font-semibold"
                  onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon/>}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              className="w-full bg-[#1B8DFF] py-3 text-3xl font-[Teko] tracking-wider cursor-pointer rounded-lg text-white font-bold hover:bg-blue-600"
              onClick={handleSignup}
            >
              Sign Up
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
export default SetPassword;
