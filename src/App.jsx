import {  useState } from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import "./App.css";
import Signup from "./components/Auth/SignUp/Signup";
import Preloader from "./components/preloader/Preloader";
import { UserProvider } from "./Context/UserContext";
import SetPassword from "./components/Auth/SignUp/SetPassword";
import VerifyOTP from "./components/Auth/SignUp/VerifyOTP";
import Home from "./components/Dashboard/Home";
import Login from "./components/Auth/Login/Login";
import VerifyPass from "./components/Auth/Login/VerifyPass";
// import  UserContext  from "./Context/Context";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <UserProvider>
       {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/verifyOtp" element={<VerifyOTP />} />
            <Route path="/setpassword" element={<SetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verifypass" element={<VerifyPass />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
       )} 

    </UserProvider>
  );
}

export default App;
