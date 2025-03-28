import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create Context
export const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
  const BACKEND_URL = "http://localhost:5001/auth";

  // SignUp content start from there
  const [SignupPhone, setSignupPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [LoginPhone, setLoginPhone] = useState("");
  const [ForgetPhone, setForgetPhone] = useState("");
  const [OTP, SetOTP] = useState("");

  // signUp content ends here

  // Match data states
  const [matchData, setMatchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [pollingActive, setPollingActive] = useState(false);
  const [pollingInterval, setPollingIntervalState] = useState(null);
  const [seriesMatchData, setSeriesMatchData] = useState(null);

  // match data states ends here

  const sendOtp = async (phonenumber) => {
    const response = await axios.post(`${BACKEND_URL}/send-otp`, {
      mobile: phonenumber,
    });
    return response.data;
  };

  const sendForgotPasswordOtp = async (phonenumber) => {
    const response = await axios.post(
      `${BACKEND_URL}/forgot-password/sendOtp`,
      { mobile: phonenumber }
    );
    return response.data;
  };

  const Updatepassword = async (mobile, oldPassword, newPassword) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/change-password`, {
        mobile,
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Password Update Error:", error);
      return {
        error: error.response?.data?.message || "Password update failed",
      };
    }
  };

  const verifyOtp = async (mobile, otp) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/verify-otp`, {
        mobile,
        otp,
      });
      return response.data;
    } catch (error) {
      console.error("OTP Verification Error:", error);
      return {
        error: error.response?.data?.message || "OTP verification failed",
      };
    }
  };

  const setPasswordHandler = async (mobile, password) => {
    await axios.post(`${BACKEND_URL}/set-password`, { mobile, password });
    alert("Signup complete! Now you can login");
  };

  const login = async (mobile, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, {
        mobile,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login succesfull! Welcome to Dashboard.");
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);

    const tokenId = credentialResponse.credential;

    if (!tokenId) {
      alert("Google authentication failed!");
      return;
    }

    const response = await axios.post(`${BACKEND_URL}/google-login`, {
      tokenId,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      alert("Login succesfull! Welcome to Dashboard.");
      window.location.href = "/";
      return { success: true, message: response.data.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token from storage
  };

  // Fetch Matches
  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5001/matches/all-stored-matches`
      );

      const extractedMatches =
        response.data?.matches?.flatMap(
          (series) =>
            series.matchScheduleList?.flatMap(
              (schedule) =>
                schedule.matchInfo?.map((match) => ({
                  matchId: match.matchId || null,
                  seriesName: schedule.seriesName || "Series Not Available",
                  format: match.matchFormat || "Format Not Available",
                  team1: match.team1?.teamName || "Team 1",
                  team2: match.team2?.teamName || "Team 2",
                  startDate: match.startDate ? Number(match.startDate) : null,
                  venue: match.venueInfo?.ground || "Venue Not Available",
                })) || []
            ) || []
        ) || [];

      // Filter only today's matches that are T20 or IPL
      const today = new Date();
      const todayMatches = extractedMatches.filter((match) => {
        if (!match.startDate) return false;
        const matchDate = new Date(match.startDate);
        return (
          matchDate.getDate() === today.getDate() &&
          matchDate.getMonth() === today.getMonth() &&
          matchDate.getFullYear() === today.getFullYear() &&
          (match.format === "T20" || match.seriesName.includes("IPL"))
        );
      });

      setMatchData(todayMatches);

      const matchesBySeries = extractedMatches.reduce((acc, match) => {
        if (!acc[match.seriesName]) {
          acc[match.seriesName] = [];
        }
        acc[match.seriesName].push(match);
        return acc;
      }, {});
      console.log(matchesBySeries);
      

      setSeriesMatchData(matchesBySeries)


      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Fetch Score Data
  const fetchScoreData = async (match) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/match-scores/${match.matchId}`
      );
  
      setScoreData(response.data);
      console.log(response.data);
      
      localStorage.setItem("MatchData", JSON.stringify(response.data));
  
      if (response.data.matchScore?.isMatchComplete) {
        stopPolling();
      }
    } catch (error) {
      console.error("Failed to fetch score:", error);
      toast.error("Failed to fetch live score. Please check your internet.");
      setError(error.message);
    }
  };

  useEffect(() => {
    if (scoreData) {
      localStorage.setItem("MatchData", JSON.stringify(scoreData));
    }
  }, [scoreData]);

  // Handle Getting Score
  const handleGetScore = async (match) => {
    setSelectedMatch(match);

    await fetchScoreData(match);
    if (!scoreData?.matchScore?.isMatchComplete) {
      startPolling(match);
    }
    if (!pollingActive) {
      startPolling(match);
    }
    localStorage.setItem("SelectedMatch", JSON.stringify(match));
    toast.info(`Selected Match: ${match.team1} vs ${match.team2}`);
    window.location.href = "/betting-interface";
  };

  // Polling Start
  const startPolling = (match) => {
    if (pollingActive || !match.matchId) return; // Prevent duplicate polling
    setPollingActive(true);
    const interval = setInterval(() => fetchScoreData(match), 1500);
    setPollingIntervalState(interval);
  };

  // Polling Stop
  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingIntervalState(null);
      setPollingActive(false);
    }
  };

  // Format Date
  const formatDate = (timestamp) => {
    return timestamp
      ? new Date(Number(timestamp)).toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Date Not Available";
  };

  useEffect(() => {
    fetchMatches();
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        SignupPhone,
        setSignupPhone,
        OTP,
        SetOTP,
        LoginPhone,
        setLoginPhone,
        confirmPassword,
        setConfirmPassword,
        sendOtp,
        verifyOtp,
        setPasswordHandler,
        login,
        logout,
        handleGoogleSuccess,
        ForgetPhone,
        setForgetPhone,
        sendForgotPasswordOtp,
        Updatepassword,
        matchData,
        isLoading,
        error,
        selectedMatch,
        scoreData,
        handleGetScore,
        formatDate,
        seriesMatchData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
