import { createContext, useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create Context
export const UserContext = createContext();

// Provider Component
export const UserProvider = ({ children }) => {
  const BACKEND_URL = "http://localhost:5001";

  // SignUp related states
  const [SignupPhone, setSignupPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [LoginPhone, setLoginPhone] = useState("");
  const [ForgetPhone, setForgetPhone] = useState("");
  const [OTP, SetOTP] = useState("");

  // Match data states
  const [matchData, setMatchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [seriesMatchData, setSeriesMatchData] = useState(null);
  const pollingIntervalRef = useRef(null);

  // Authentication Methods
  const sendOtp = async (phonenumber) => {
    const response = await axios.post(`${BACKEND_URL}/auth/send-otp`, {
      mobile: phonenumber,
    });
    return response.data;
  };

  const sendForgotPasswordOtp = async (phonenumber) => {
    const response = await axios.post(
      `${BACKEND_URL}/auth/forgot-password/sendOtp`,
      { mobile: phonenumber }
    );
    return response.data;
  };

  const Updatepassword = async (mobile, oldPassword, newPassword) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/change-password`, {
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
      const response = await axios.post(`${BACKEND_URL}/auth/verify-otp`, {
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
    await axios.post(`${BACKEND_URL}/auth/set-password`, { mobile, password });
    alert("Signup complete! Now you can login");
  };

  const login = async (mobile, password) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        mobile,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        alert("Login successful! Welcome to Dashboard.");
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
    const tokenId = credentialResponse.credential;

    if (!tokenId) {
      alert("Google authentication failed!");
      return;
    }

    const response = await axios.post(`${BACKEND_URL}/auth/google-login`, {
      tokenId,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      alert("Login successful! Welcome to Dashboard.");
      window.location.href = "/";
      return { success: true, message: response.data.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  // Fetch Matches with improved error handling and live match selection
  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/matches/all-stored-matches`);

      const extractedMatches = response.data?.matches?.flatMap(
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

      // Filter today's live matches
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

      // Organize matches by series
      const matchesBySeries = todayMatches.reduce((acc, match) => {
        if (!acc[match.seriesName]) {
          acc[match.seriesName] = [];
        }
        acc[match.seriesName].push(match);
        return acc;
      }, {});
      setSeriesMatchData(matchesBySeries);

      setIsLoading(false);

      // Automatically start polling for the first match if exists
      if (todayMatches.length > 0) {
        startAutoPolling(todayMatches[0]);
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
      setError(error.message);
      setIsLoading(false);
      toast.error("Failed to fetch matches. Please check your connection.");
    }
  };

  // Optimized score fetching with error handling
  const fetchScoreData = useCallback(async (match) => {
    if (!match || !match.matchId) return;

    try {
      const response = await axios.get(
        `${BACKEND_URL}/match-scores/${match.matchId}`
      );

      // Update local storage and state
      const newScoreData = response.data;
      setScoreData(newScoreData);
      localStorage.setItem("MatchData", JSON.stringify(newScoreData));
      localStorage.setItem("SelectedMatch", JSON.stringify(match));

      // Stop polling if match is complete
      if (newScoreData.matchScore?.isMatchComplete) {
        stopAutoPolling();
        toast.info("Match completed!");
      }
    } catch (error) {
      console.error("Failed to fetch score:", error);
      toast.error("Failed to fetch live score. Retrying...");
    }
  }, []);

  // Start automatic polling
  const startAutoPolling = useCallback((match) => {
    // Clear any existing interval
    stopAutoPolling();

    // Set selected match
    setSelectedMatch(match);
    localStorage.setItem("SelectedMatch", JSON.stringify(match));

    // Initial fetch
    fetchScoreData(match);

    // Start polling interval
    pollingIntervalRef.current = setInterval(() => {
      fetchScoreData(match);
    }, 1500); // 1.5 seconds interval
  }, [fetchScoreData]);

  // Stop automatic polling
  const stopAutoPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Manually select and start polling for a specific match
  const handleGetScore = async (match) => {
    setSelectedMatch(match);
    await fetchScoreData(match);
    startAutoPolling(match);
    localStorage.setItem("SelectedMatch", JSON.stringify(match));
    toast.info(`Selected Match: ${match.team1} vs ${match.team2}`);
    window.location.href = "/betting-interface";
  };

  // Cleanup on component unmount
  useEffect(() => {
    fetchMatches();

    // Cleanup function
    return () => {
      stopAutoPolling();
    };
  }, []);

  // Format date utility
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

  return (
    <UserContext.Provider
      value={{
        // Authentication methods
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

        // Match-related data and methods
        matchData,
        isLoading,
        error,
        selectedMatch,
        scoreData,
        seriesMatchData,
        handleGetScore,
        formatDate,
        startAutoPolling,
        stopAutoPolling
      }}
    >
      {children}
    </UserContext.Provider>
  );
};