import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "./GoogleIcon";

const GoogleLoginButton = () => {
  const BACKEND_URL = "http://localhost:5001/auth"
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Token Response:", tokenResponse);

      const response = await axios.post(
        `${BACKEND_URL}/google-login`,
        { tokenId: tokenResponse.credential }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful! Welcome to Dashboard.");
      }
    },
    onError: () => alert("Google Login Failed"),
  });

  return (
    <button
      onClick={login}
      className="w-full flex justify-start cursor-pointer border border-gray-700 p-2 rounded-lg text-xl items-center outline-2 outline-gray-500 text-gray-400 hover:bg-gray-700 transition duration-300"
    >
      <GoogleIcon className="mr-2 h-5 w-5" />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
