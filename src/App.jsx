import {useEffect, useState } from "react";
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
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ForgetPass from "./components/Auth/Forgetpass/ForgetPass";
import ForgetVerifyOtp from "./components/Auth/Forgetpass/ForgetVerifyOtp";
import NotFound from "./components/PrivateRoute/NotFound";
import ChangePass from "./components/Auth/Forgetpass/ChangePass";
import CurrentMatch from "./components/Dashboard/CurrentMatches/CurrentMatch";
import BettingInterface from "./components/Dashboard/mini-components/BettingInterface";
import {ToastContainer} from 'react-toastify'
import UserProfile from "./components/Dashboard/Profile/UserProfile";
import Portfolio from "./components/Dashboard/mini-components/Portfolio";
import Teamstats from "./components/Dashboard/mini-components/Teamstats";
import Contact from "./components/Dashboard/StaticComponents/Contact";
import About from "./components/Dashboard/StaticComponents/About";
import Transactions from './components/Dashboard/Transactions';
import Withdraw from './components/Dashboard/Withdraw';
import KYCVerification from './components/Dashboard/KYC';
import InviteFriends from './components/Dashboard/Invite';
import TermsAndConditions from './components/Dashboard/Legal/TermsAndConditions';
import PrivacyPolicy from './components/Dashboard/Legal/PrivacyPolicy';
import PaymentStatus from './components/Payments/PaymentStatus';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSeenLoader = sessionStorage.getItem("hasSeenLoader");

    if (!hasSeenLoader) {
      setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("hasSeenLoader", "true");
      }, 4100); // Adjust the time as needed
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserProvider>
       {loading ? (
         <Preloader onComplete={() => setLoading(false)} />
        ) : (
          <>
            <ToastContainer position="top-right" autoClose={1500} />
          <Router>
          <Routes>
            {/* Main Dashboard Routes */}
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            
            {/* Cricket Match & Betting Routes */}
            <Route path="/betting-interface" element={<PrivateRoute><BettingInterface /></PrivateRoute>} />
            <Route path="/live-matches" element={<PrivateRoute><CurrentMatch /></PrivateRoute>} />
            <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
            <Route path="/team-stats" element={<PrivateRoute><Teamstats /></PrivateRoute>} />
            
            {/* Payment Routes */}
            <Route path="/payment/orders/:orderId" element={<PrivateRoute><PaymentStatus /></PrivateRoute>} />
            <Route path="/payment/status/undefined" element={<PrivateRoute>
              <NotFound/>
              </PrivateRoute>} />
            
            {/* User Account & Profile Routes */}
            <Route path="/UserProfile" element={<PrivateRoute><UserProfile/></PrivateRoute>}/>
            <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
            <Route path="/withdraw" element={<PrivateRoute><Withdraw /></PrivateRoute>} />
            <Route path="/kyc" element={<PrivateRoute><KYCVerification /></PrivateRoute>} />
            <Route path="/invite" element={<PrivateRoute><InviteFriends /></PrivateRoute>} />
            
            {/* Static & Information Pages */}
            <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
            <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
            <Route path="/terms" element={<PrivateRoute><TermsAndConditions /></PrivateRoute>} />
            <Route path="/privacy" element={<PrivateRoute><PrivacyPolicy /></PrivateRoute>} />          
            
            {/* Authentication Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/verifyOtp" element={<VerifyOTP />} />
            <Route path="/setpassword" element={<SetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verifypass" element={<VerifyPass />} />
            <Route path="/forgot-password" element={<ForgetPass/>}/> 
            <Route path="/forgot-password/verify-password" element={<ForgetVerifyOtp/>}/> 
            <Route path="/forgot-password/changePass" element={<ChangePass/>} />
            
            {/* 404 Route */}
            <Route path="/*" element={<NotFound/>} />

          </Routes>
        </Router>
          </>
       )} 

    </UserProvider>
  );
}

export default App;
