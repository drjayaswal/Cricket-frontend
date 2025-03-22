import React, { useContext } from 'react'
import GoogleIcon from '../../GoogleIcon/GoogleIcon';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Context/UserContext';

const Login = () => {

  const { LoginPhone, setLoginPhone } = useContext(UserContext);

    const navigate = useNavigate()


    const handleNext = (e)=>{
        e.preventDefault();
        if(LoginPhone) {
        navigate("/verifypass")
        }else{
          alert("Please fill out all required fields.")
          return;
        }
    }

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
            <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Phone Number*"
                  className="border-gray-700 cursor-pointer  p-4 rounded-lg text-white outline-2 outline-gray-500 w-full"
                  value={LoginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                />
            </div>
            <button className="w-full bg-[#1B8DFF] font-[Teko] tracking-wider py-3 text-2xl cursor-pointer rounded-lg text-white font-bold hover:bg-blue-600"
            onClick={handleNext}
            >
              Continue
            </button>
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <button href="#" className="text-blue-400 hover:underline cursor-pointer"
              onClick={()=>navigate("/")}
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
}
export default Login

  