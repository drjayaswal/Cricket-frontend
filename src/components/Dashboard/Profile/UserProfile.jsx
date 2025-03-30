"use client"

import { useState, useRef, useContext } from "react"
import { Camera, ChevronRight, Edit, LogOut, Phone, Shield, Users } from "lucide-react"
import { UserContext } from "../../../Context/UserContext"
import { useNavigate } from "react-router-dom"

export default function ProfilePage() {
  const [balance, setBalance] = useState(100.0)
  const [name, setName] = useState("John Doe")
  const [phoneNumber, setPhoneNumber] = useState("+91 9876543210")
  const [showEditPhone, setShowEditPhone] = useState(false)
  const [newPhoneNumber, setNewPhoneNumber] = useState("")
  const fileInputRef = useRef(null)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=80&width=80")
  const [showAddMoney, setShowAddMoney] = useState(false)
  const [addAmount, setAddAmount] = useState("")

  // Add this function after the existing state declarations:

    const{logout} = useContext(UserContext)
  const navigate = useNavigate()


  const handleMenuClick = (menuItem) => {
    // Handle different menu item clicks
    switch (menuItem) {
      case "My Transaction":
        alert("Viewing transactions")
        // Navigate to transactions page or show transactions modal
        break
      case "Withdraw":
        alert("Opening withdraw interface")
        // Open withdraw modal or navigate to withdraw page
        break
      case "KYC Verification":
        alert("Opening KYC verification")
        // Navigate to KYC verification page
        break
      case "Invite Friends":
        alert("Opening invite friends")
        // Open share dialog or navigate to invite page
        break
      case "Terms and Conditions":
        alert("Opening Terms and Conditions")
        // Navigate to terms page or open in modal
        break
      case "Privacy Policy":
        alert("Opening Privacy Policy")
        // Navigate to privacy policy page or open in modal
        break
      case "Contact Us":
        alert("Opening Contact form")
        // Navigate to contact page or open contact modal
        break
      case "Logout":
        if (confirm("Are you sure you want to logout?")) {
            logout()
            navigate("/login")
        }
        break
      default:
        console.log(`Clicked on ${menuItem}`)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePhoneSubmit = (e) => {
    e.preventDefault()
    if (newPhoneNumber.trim()) {
      setPhoneNumber(newPhoneNumber)
      setShowEditPhone(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white">
      {/* Header with profile */}
      <div className="relative bg-gradient-to-r from-green-800 to-green-700 p-4 flex items-center">
        <div className="relative">
          <img
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-white object-cover"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1"
          >
            <Camera size={16} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </div>
        <div className="ml-4">
          <h2 className="font-semibold text-lg">{name}</h2>
          <div className="flex items-center">
            <span className="text-sm">{phoneNumber}</span>
            <button onClick={() => setShowEditPhone(true)} className="ml-2 text-white">
              <Edit size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Phone number edit modal */}
      {showEditPhone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-800">
            <h3 className="font-bold text-lg mb-4">Update Phone Number</h3>
            <form onSubmit={handlePhoneSubmit}>
              <input
                type="tel"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="Enter new phone number"
                className="w-full p-2 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowEditPhone(false)} className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Money modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md text-gray-800">
            <h3 className="font-bold text-lg mb-4">Add Money</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const amount = Number.parseFloat(addAmount)
                if (!isNaN(amount) && amount > 0) {
                  setBalance((prevBalance) => prevBalance + amount)
                  setAddAmount("")
                  setShowAddMoney(false)
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Amount (₹)</label>
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
                <button type="button" onClick={() => setShowAddMoney(false)} className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Add Money
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Balance Card */}
      <div className="p-4">
        <div className="bg-blue-500 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-xs opacity-80">BALANCE</p>
            <p className="text-2xl font-bold">₹ {balance.toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddMoney(true)}
              className="bg-blue-600 hover:bg-blue-700 rounded-full p-2 flex items-center"
            >
              <span className="mr-1">+</span>
              <span className="hidden sm:inline">Add Money</span>
            </button>
            <button className="bg-blue-600 rounded-full p-2">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">My Account</h3>
          <div className="bg-blue-800 bg-opacity-30 rounded-lg">
            <MenuItem
              icon={<ChevronRight size={18} />}
              text="My Transaction"
              onClick={() => handleMenuClick("My Transaction")}
            />
            <MenuItem icon={<ChevronRight size={18} />} text="Withdraw" onClick={() => handleMenuClick("Withdraw")} />
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

        <div>
          <h3 className="text-lg font-semibold mb-2">Legality & Security</h3>
          <div className="bg-blue-800 bg-opacity-30 rounded-lg">
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
              icon={<LogOut size={18} />}
              text="Logout"
              isLast={true}
              onClick={() => handleMenuClick("Logout")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MenuItem({ icon, text, isLast = false, onClick }) {
  return (
    <div
      className={`flex items-center justify-between p-3 ${!isLast && "border-b border-blue-700"} cursor-pointer hover:bg-blue-700 hover:bg-opacity-30 transition-colors`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className="mr-3 text-blue-300">{getIconForMenuItem(text)}</span>
        <span>{text}</span>
      </div>
      <span className="text-blue-300">{icon}</span>
    </div>
  )
}

function getIconForMenuItem(text) {
  switch (text) {
    case "My Transaction":
      return <ChevronRight size={18} />
    case "Withdraw":
      return <ChevronRight size={18} />
    case "KYC Verification":
      return <Shield size={18} />
    case "Invite Friends":
      return <Users size={18} />
    case "Terms and Conditions":
      return <ChevronRight size={18} />
    case "Privacy Policy":
      return <ChevronRight size={18} />
    case "Contact Us":
      return <Phone size={18} />
    case "Logout":
      return <LogOut size={18} />
    default:
      return <ChevronRight size={18} />
  }
}

