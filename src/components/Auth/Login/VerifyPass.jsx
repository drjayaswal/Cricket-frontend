import { useNavigate } from "react-router-dom";
import GoogleIcon from "../../GoogleIcon/GoogleIcon";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../Context/UserContext";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const VerifyPass = () => {
  const navigate = useNavigate();

  const { LoginPhone,login } = useContext(UserContext);
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [error,setError] = useState("")

  useEffect(()=>{
    if(!LoginPhone){
      navigate("/login")
    }
  })
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter password");
      return;
    }

    const response = await login(LoginPhone, password);
    
    if (response.success) {
      navigate("/home"); // Redirect to dashboard after successful login
    } else {
      setError(response.message);
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
            <h1 className="text-center text-4xl font-bold text-white font-[Teko] tracking-wider">
              Welcome back
            </h1>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Mobile number*"
                className="border-gray-700 cursor-pointer  p-4 rounded-lg text-gray-500 outline-2 outline-gray-500 w-full"
                value={LoginPhone}
                disabled
              />
              <button
                className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 font-semibold"
                onClick={() => navigate(-1)}
              >
                Edit
              </button>
            </div>
            <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password*"
                  className="border-gray-700 cursor-pointer  p-4 rounded-lg text-white outline-2 outline-gray-500 w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 font-semibold"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon/>}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="text-white py-2">
                  <p className="text-xs text-gray-500">
                    Forgot your password?{" "}
                    <a
                      href=""
                      className="text-blue-400 hover:underline"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Reset it here
                    </a>
                  </p>
                </div>
              </div>
            <button
              className="w-full bg-[#1B8DFF] font-[Teko] tracking-wider py-3 text-2xl cursor-pointer rounded-lg text-white font-bold hover:bg-blue-600"
              onClick={handleLogin} 
            >
              Continue
            </button>
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <button
                href="#"
                className="text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate("/")}
              >
                SignUp
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <hr className=" w-[45%]  text-gray-400" />
            <span className=" text-gray-400">OR</span>
            <hr className=" w-[45%]  text-gray-400" />
          </div>

          {/* Alternative login methods */}
          <div className="space-y-6">
            <button className="w-full flex justify-start cursor-pointer border-gray-700 p-2 rounded-lg text-xl items-center outline-2 outline-gray-500 text-gray-400">
              <GoogleIcon className="mr-2 h-5 w-5" />
              <span>Continue with Google</span>
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

export default VerifyPass;
