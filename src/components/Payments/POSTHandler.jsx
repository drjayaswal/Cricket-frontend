import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function POSTHandler() {
  const { transactionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait a tick so PhonePe POST payload (if any) is ignored
    setTimeout(() => {
      navigate(`/payment/status/view/${transactionId}`, { replace: true });
    }, 100); // Small delay just to allow for smooth redirect
  }, [transactionId, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Processing your payment...</h2>
    </div>
  );
}