import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import jsPDF from "jspdf";
import "./PaymentStatus.css";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const BACK = import.meta.env.VITE_BACKEND_URL;

  const { txnId } = useParams();

  const [paymentData, setPaymentData] = useState(null);


  const goToHome = () => {
    navigate("/UserProfile");
  };

  const getStatusClass = (state) => {
    switch (state) {
      case "COMPLETED":
        return "success";
      case "PENDING":
        return "pending";
      case "FAILED":
        return "failed";
      default:
        return "";
    }
  };

  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Payment Receipt", 20, 20);

    doc.setFontSize(12);
    let y = 40;

    const addLine = (label, value) => {
      doc.text(`${label}: ${value || "N/A"}`, 20, y);
      y += 10;
    };

    const instr = paymentData?.paymentInstrument || {};
    const txnId = paymentData?.transactionId ?? paymentData?.TID ?? "Unknown";

    addLine("Transaction ID", txnId);
    addLine("Merchant Transaction ID", paymentData?.merchantTransactionId);
    addLine("Merchant ID", paymentData?.merchantId);
    addLine("Status", paymentData?.state);
    addLine("Amount (INR)", paymentData?.amount);
    addLine("Payment Type", instr?.type);

    switch (instr.type) {
      case "UPI":
        addLine("Account Holder", instr.accountHolderName);
        addLine("Account Type", instr.accountType);
        addLine("UPI Transaction ID", instr.upiTransactionId);
        addLine("UTR", instr.utr);
        break;
      case "NETBANKING":
        addLine("Bank Transaction ID", instr.bankTransactionId);
        addLine("Bank ID", instr.bankId);
        addLine("ARN", instr.arn);
        break;
      case "CARD":
        addLine("Card Type", instr.cardType);
        addLine("Card Network", instr.cardNetwork);
        addLine("Last 4 Digits", instr.lastFourDigits);
        break;
      case "WALLET":
        addLine("Wallet Name", instr.walletName);
        break;
      default:
        if (instr && Object.keys(instr).length > 0) {
          addLine("Additional Info", JSON.stringify(instr, null, 2));
        } else {
          addLine("Payment Info", "Unavailable or incomplete.");
        }
    }

    doc.save(`receipt_${txnId}.pdf`);
  };

  const getTransactionStatus = async () => {
    try {
      const response = await axios.get(`${BACK}/payment/orders/${txnId}`);
      console.log(response)
      // return
      const data = response.data.response;

      const payment = data.paymentDetails[0];
      const instrument = {
        ...payment.instrument,
        ...payment.rail,
      };

      const mappedData = {
        transactionId: payment.transactionId,
        merchantTransactionId: data.orderId,
        merchantId: "CRICKSTOCK 11",
        state: data.state || payment.state,
        amount: data.amount,
        payableAmount: data.payableAmount,
        paymentInstrument: instrument,
      };
      setPaymentData(mappedData);
      console.log(mappedData)

      setTimeout(
        () => {
          goToHome()
        },
        10*1000
      );
    } catch (error) {
      toast.error("Failed to fetch payment status.");
      console.error("Transaction fetch error:", error);

    }
  };
  useEffect(() => {
    getTransactionStatus();
  }, []);


  return (
    <div className="payment-status-container" onClick={goToHome}>
      <div className="payment-card">
        <h2 className="payment-title">Payment Status</h2>
        <div className="payment-details">
          <div className="detail-item">
            <span className="label">Transaction ID:</span>
            <span className="value">{txnId}</span>
          </div>

          <div className="detail-item">
            <span className="label">Merchant Transaction ID:</span>
            <span className="value">{paymentData?.merchantTransactionId}</span>
          </div>

          <div className="detail-item">
            <span className="label">Merchant ID:</span>
            <span className="value">{paymentData?.merchantId}</span>
          </div>

          <div className="detail-item">
            <span className="label">Status:</span>
            <span
              className={`value status ${getStatusClass(paymentData?.state)}`}
            >
              {paymentData?.state}
            </span>
          </div>

          <div className="detail-item">
            <span className="label">Amount:</span>
            <span className="value">₹{paymentData?.amount}</span>
          </div>

          <div className="detail-item">
            <span className="label">Payment Type:</span>
            <span className="value">
              {paymentData?.paymentInstrument?.type || "N/A"}
            </span>
          </div>

          {paymentData?.paymentInstrument &&
            Object.entries(paymentData.paymentInstrument).map(
              ([key, value]) => (
                <div className="detail-item" key={key}>
                  <span className="label">{key.toLocaleUpperCase()}</span>
                  <span className="value">{value || "N/A"}</span>
                </div>
              )
            )}

          <div className="home-btn-container">
            <button className="download-btn" onClick={downloadReceipt}>
              Download Receipt
            </button>
            <button className="home-btn" onClick={goToHome}>
              ⬅ Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
