import { useState, useRef, useContext } from "react";
import {
  Camera,
  ChevronRight,
  UserLock,
  Edit,
  HandCoins,
  Handshake,
  LogOut,
  Phone,
  Shield,
  User,
  Users,
} from "lucide-react";
import { UserContext } from "../../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import VerifiedIcon from "@mui/icons-material/Verified";
import { toast } from "react-toastify";
import dmdp from "/assets/dmdp.jpg?url";
import dpBanner from "/assets/dp-banner.jpg";
import { Money, Payment, Policy } from "@mui/icons-material";
import plus from "/assets/plus.svg";
import { load } from "@cashfreepayments/cashfree-js";

const cashfree = await load({
  mode: "sandbox",
});

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export default function ProfilePage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [showVerifyOtp, setShowVerifyOtp] = useState(false);
  const fileInputRef = useRef(null);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [OTP, SetOTP] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, user, uploadImage, VerifyMobile, verifyMobileOtp } =
  useContext(UserContext);
  const [balance, setBalance] = useState(user.amount);
  const navigate = useNavigate();

  const checkOut = (ID) => {
    cashfree.checkout({
      paymentSessionId: ID,
      redirectTarget: `/payment/orders/${ID}`,
    });
  };

  const handlePaymentRequest = async (amount) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login again");
      toast.success("Redirecting to payment...");
      
      const orderRes = await fetch(`${BACKEND_URL}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      
  
      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || "Payment request failed");
      }
  
      const data = await orderRes.json();
      const sessionId = data.orderDetails.paymentSessionId;
      console.log(data.orderDetails.orderId)
      checkOut(sessionId);
    } catch (error) {
      toast.error(error.message || "Payment failed");
    }
  };
  // Authentication Handlers
  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    navigate("/login");
  };

  // Navigation Handlers
  const handleMenuClick = (menuItem) => {
    switch (menuItem) {
      case "My Transaction":
        navigate("/transactions");
        break;
      case "Withdraw":
        navigate("/withdraw");
        break;
      case "KYC Verification":
        navigate("/kyc");
        break;
      case "Invite Friends":
        navigate("/invite");
        break;
      case "Terms and Conditions":
        navigate("/terms");
        break;
      case "Privacy Policy":
        navigate("/privacy");
        break;
      case "Contact Us":
        navigate("/contact");
        break;
      case "Logout":
        setIsLoggingOut(true);
        break;
      default:
        console.log(`Clicked on ${menuItem}`);
    }
  };

  // Profile Image Handlers
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB");
      return;
    }
    if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
      toast.error("Image should be in PNG, JPEG, or JPG format");
      return;
    }

    try {
      const toastId = toast.loading("Uploading image...");

      const uploading = new Promise((resolve, reject) => {
        uploadImage(file)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });

      await uploading;
      toast.update(toastId, {
        render: "Image uploaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading image: " + error.message);
    }
  };

  // Phone Verification Handlers
  const handlePhoneSubmit = async (e, mobile) => {
    e.preventDefault();
    // check mobile number is start with +91
    let phoneNumber = mobile.trim();

    // Remove spaces, dashes, or non-numeric characters
    phoneNumber = phoneNumber.replace(/\D/g, "");

    // Ensure it starts with +91
    if (!phoneNumber.startsWith("91")) {
      phoneNumber = `91${phoneNumber}`;
    }

    phoneNumber = `+${phoneNumber}`;

    const phoneRegex = /^\+91[6-9]\d{9}$/;

    if (!phoneRegex.test(phoneNumber)) {
      toast.error(
        "Invalid phone number. Must be a valid Indian number (+91XXXXXXXXXX)."
      );
      return;
    }

    if (phoneNumber) {
      console.log(phoneNumber);

      await VerifyMobile(phoneNumber);
      // setPhoneNumber("")
      setShowVerifyOtp(true);
      setShowEditPhone(false);
    } else {
      toast.error("Please enter a valid phone number.");
    }
  };

  const handleCloseProfile = () => {
    navigate("/");
  };

  const handleVerifyNumber = async (e, mobile, otp) => {
    e.preventDefault();

    // check mobile number is start with +91
    let phoneNumber = mobile.trim();

    // Remove spaces, dashes, or non-numeric characters
    phoneNumber = phoneNumber.replace(/\D/g, "");

    // Ensure it starts with +91
    if (!phoneNumber.startsWith("91")) {
      phoneNumber = `91${phoneNumber}`;
    }

    phoneNumber = `+${phoneNumber}`;

    const phoneRegex = /^\+91[6-9]\d{9}$/;

    if (!phoneRegex.test(phoneNumber)) {
      toast.error(
        "Invalid phone number. Must be a valid Indian number (+91XXXXXXXXXX)."
      );
      return;
    }

    if (otp) {
      await verifyMobileOtp(phoneNumber, otp);
      setShowVerifyOtp(false);
      setShowEditPhone(false);
      setPhoneNumber("");
      SetOTP("");
    }
  };

  return (
    <div className="min-h-screen realtive text-white">
      {/* Profile Header Section */}
      <div
        className="absolute top-2 right-2 z-100"
        onClick={handleCloseProfile}
      >
        <CancelIcon />
      </div>
      <img
        src={dpBanner}
        alt="Profile Banner"
        className="w-full h-32 object-cover rounded-lg absolute"
        style={{
          filter: "blur(3px)",
          height: "100px",
        }}
      />
      <div className="relative dp-banner p-4 flex items-center">
        <div className="relative">
          <img
            src={user.profileImage ? user.profileImage : dmdp}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-white object-cover"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1"
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="ml-4">
          <h2 className="font-semibold text-lg">{user?.name}</h2>
          <div className="flex items-center">
            <span className="text-sm">{user.mobile}</span>
            <button
              onClick={() => setShowEditPhone(true)}
              className="ml-2 text-white"
            >
              {user.isVerified ? (
                <VerifiedIcon />
              ) : (
                <span className="flex items-center gap-2">
                  Verify number <Edit size={14} />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      {/* Phone Number Edit Modal */}
      {showEditPhone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-800">
            <h3 className="font-bold text-lg mb-4">Enter Phone Number</h3>
            <form onSubmit={(e) => handlePhoneSubmit(e, phoneNumber)}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter new phone number"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditPhone(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showVerifyOtp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-800">
            <h3 className="font-bold text-lg mb-4">Enter OTP</h3>
            <form onSubmit={(e) => handleVerifyNumber(e, phoneNumber, OTP)}>
              <input
                type="tel"
                value={OTP}
                onChange={(e) => SetOTP(e.target.value)}
                placeholder="Enter new phone number"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVerifyOtp(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-800">
            <h3 className="font-bold text-lg mb-4">Add Money</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const amount = Number.parseFloat(addAmount);
                if (!isNaN(amount) && amount > 0) {
                  try {
                    handlePaymentRequest(amount);
                    setAddAmount("");
                    setShowAddMoney(false);
                  } catch (error) {
                    console.error("Payment error:", error);
                  }
                } else {
                  toast.error("Please enter a valid amount");
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-2 border border-gray-300 rounded"
                  min="1"
                  step="any"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMoney(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Balance Display Section */}
      <div className="p-4">
        <div className="bg-[#1671CC] rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-xs opacity-80">Wallet Balance</p>
            <p className="text-2xl font-bold">₹ {balance}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddMoney(true)}
              className="border-1 hover:border-[#1671CC] border-transparent bg-transparent hover:bg-[#002865] rounded-full px-4 py-2 flex items-center hover:text-[#16711CC] text-white"
            >
              <img className="mr-2 w-5 h-5" src={plus} alt="" />
              <span className="">Add Money</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Navigation Section */}
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">My Account</h3>
          <div className="bg-[#002865] bg-opacity-30 rounded-lg">
            <MenuItem
              icon={<ChevronRight size={18} />}
              text="My Transaction"
              onClick={() => handleMenuClick("My Transaction")}
            />
            <MenuItem
              icon={<ChevronRight size={18} />}
              text="Withdraw"
              onClick={() => handleMenuClick("Withdraw")}
            />
            <MenuItem
              icon={<ChevronRight size={18} />}
              text="KYC Verification"
              onClick={() => handleMenuClick("KYC Verification")}
            />
            <MenuItem
              icon={<ChevronRight size={18} />}
              text="Invite Friends"
              onClick={() => handleMenuClick("Invite Friends")}
            />
          </div>
        </div>
        {/* Logout Confirmation Modal */}
        {isLoggingOut && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-800">
              <h3 className="font-bold text-lg mb-4">
                Do you really want to logout?
              </h3>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLoggingOut(false)} // Close the modal
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout} // Confirm logout
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Legality & Security</h3>
          <div className="bg-[#002865] bg-opacity-30 rounded-lg">
            <MenuItem
              icon={<ChevronRight size={18} />}
              text="Terms and Conditions"
              onClick={() => handleMenuClick("Terms and Conditions")}
            />
            <MenuItem
              icon={<ChevronRight size={18} />}
              text="Privacy Policy"
              onClick={() => handleMenuClick("Privacy Policy")}
            />
            <MenuItem
              icon={<ChevronRight size={18} />}
              text="Contact Us"
              onClick={() => handleMenuClick("Contact Us")}
            />
            <MenuItem
              icon={<UserLock size={18} />}
              text="Admin Dashboard"
              isLast={true}
              // onClick={handleNavigateAdmin}
            />
            <MenuItem
              icon={<LogOut size={18} />}
              text="Logout"
              isLast={true}
              onClick={() => handleMenuClick("Logout")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, text, isLast = false, onClick }) {
  return (
    <div
      className={`flex rounded-lg items-center justify-between p-3 cursor-pointer hover:bg-[#1671CC] hover:bg-opacity-30 transition-colors`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className="mr-3 text-blue-300">{getIconForMenuItem(text)}</span>
        <span>{text}</span>
      </div>
      <span className="text-blue-300">{<ChevronRight />}</span>
    </div>
  );
}

function getIconForMenuItem(text) {
  switch (text) {
    case "My Transaction":
      return <Payment size={18} />;
    case "Withdraw":
      return <HandCoins size={18} />;
    case "KYC Verification":
      return <Shield size={18} />;
    case "Invite Friends":
      return <Users size={18} />;
    case "Terms and Conditions":
      return <Handshake size={18} />;
    case "Privacy Policy":
      return <Policy size={18} />;
    case "Contact Us":
      return <Phone size={18} />;
    case "Logout":
      return <LogOut size={18} />;
    default:
      return <ChevronRight size={18} />;
  }
}
