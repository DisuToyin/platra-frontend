import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("Verifying payment...");

  useEffect(() => {
    if (!reference) {
      navigate("/payment/failure");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/verify?reference=${reference}`);
        const data = await res.json();

        if (data.success) {
          setStatusMessage("Payment verified! Redirecting...");
          setTimeout(() => navigate(`/payment/success?reference=${reference}`), 1200);
        } else {
          setStatusMessage("Verification failed. Redirecting...");
          setTimeout(() => navigate(`/payment/failure?reference=${reference}`), 1200);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatusMessage("Network error. Redirecting...");
        setTimeout(() => navigate(`/payment/failure?reference=${reference}`), 1200);
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="animate-pulse text-gray-700 text-lg">{statusMessage}</div>
      <div className="mt-4 h-10 w-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
    </div>
  );
};

export default PaymentVerification;
