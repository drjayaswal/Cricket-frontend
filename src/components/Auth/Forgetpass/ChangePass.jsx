import React, { useContext, useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { UserContext } from "../../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChangePass = () => {
  const [showOldPassword, setshowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {ForgetPhone,Updatepassword} = useContext(UserContext)
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  console.log(ForgetPhone);
  

  const handleChangePassword = async (e) => {
    e.preventDefault();
    console.log(ForgetPhone);
  
    if (!oldPassword || !password || !confirmPassword) {
      setError("All fields are required.");
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
    }
  
    setError("");

  
    try {
      const response = await Updatepassword(ForgetPhone,oldPassword,password)     
  
      if (response?.message === "Password changed successfully") {
        toast.succes("Password changed successfully!");
        navigate("/");
      } else if(response?.message === "User not found"){
        toast.info("User not found Go Register first!!!");
        navigate("/signup");
      }else if(response?.message === "Incorrect old password"){
        toast.error("Incorrect old password");
        
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Password change failed. Please try again.");
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
              Enter Your New password
            </p>
          </div>

          {/* Form */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter Your Old Password*"
                  className="border-gray-700 cursor-pointer  p-4 rounded-lg text-white outline-2 outline-gray-500 w-full"
                    value={oldPassword}
                    onChange={(e) =>  {
                  setOldPassword(e.target.value);
                  setError(""); // Clear error on change
                    }}
                />
                <button
                  className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 font-semibold"
                  onClick={() => setshowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password*"
                  className="border-gray-700 cursor-pointer  p-4 rounded-lg text-white outline-2 outline-gray-500 w-full"
                    value={password}
                    onChange={(e) =>  {
                  setPassword(e.target.value);
                  setError(""); // Clear error on change
                    }}
                />
                <button
                  className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 font-semibold"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New password*"
                  className="border-gray-700 cursor-pointer  p-4 rounded-lg text-white outline-2 outline-gray-500 w-full"
                    value={confirmPassword}
                    onChange={(e) =>  {
                  setConfirmPassword(e.target.value);
                  setError(""); // Clear error on change
                    }}
                />
                <button
                  className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 font-semibold"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              className="w-full bg-[#1B8DFF] py-3 text-3xl font-[Teko] tracking-wider cursor-pointer rounded-lg text-white font-bold hover:bg-blue-600"
                onClick={handleChangePassword}
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
  );
};

export default ChangePass;
