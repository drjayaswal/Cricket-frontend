import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./PaymentStatus.css"; // Add this import

const PaymentStatus = () => {
  const { transactionId } = useParams();
  const [paymentData, setPaymentData] = useState(null);
  const fetchTransaction = async () => {
    try {
      const response = await axios.post(`http://localhost:5002/payment/transactionData/${transactionId}`);
      setPaymentData(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch payment data.");
    }
  };
  useEffect(() => {
    fetchTransaction();
  }, []);

  if (!paymentData) return (
    <div className="loading-container">
        <div className="loader"></div>
        <p>Loading payment data...</p>
    </div>
);

return (
<div className="payment-status-container">
  <div className="payment-card">
    <h2 className="payment-title">Payment Status</h2>
    <div className="payment-details">
      <div className="detail-item">
        <span className="label">Transaction ID:</span>
        <span className="value">{paymentData.TID}</span>
      </div>

      <div className="detail-item">
        <span className="label">Status:</span>
        <span className={`value status ${paymentData.status === "Success" ? "success" : paymentData.status === "Pending" ? "pending" : "failed"}`}>
          {paymentData.status}
        </span>
      </div>

      <div className="detail-item">
        <span className="label">Amount:</span>
        <span className="value">₹{paymentData.amount}</span>
      </div>

      <div className="detail-item">
        <span className="label">Payment Type:</span>
        <span className="value">{paymentData.paymentInstrument?.type || "N/A"}</span>
      </div>

      {paymentData.paymentInstrument?.type === "UPI" && (
        <>
          <div className="detail-item">
            <span className="label">Account Holder:</span>
            <span className="value">{paymentData.paymentInstrument.accountHolderName}</span>
          </div>
          <div className="detail-item">
            <span className="label">Account Type:</span>
            <span className="value">{paymentData.paymentInstrument.accountType}</span>
          </div>
          <div className="detail-item">
            <span className="label">UPI Transaction ID:</span>
            <span className="value">{paymentData.paymentInstrument.upiTransactionId}</span>
          </div>
          <div className="detail-item">
            <span className="label">UTR:</span>
            <span className="value">{paymentData.paymentInstrument.utr}</span>
          </div>
        </>
      )}
    </div>
  </div>
</div>);
};
export default PaymentStatus;
