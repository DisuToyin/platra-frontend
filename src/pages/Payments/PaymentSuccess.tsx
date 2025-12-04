import { useSearchParams, Link } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-700">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your order. Your payment was verified successfully.
        </p>

        {reference && (
          <p className="mt-4 text-sm text-gray-500">
            Reference: <span className="font-mono">{reference}</span>
          </p>
        )}

        <Link
          to="/"
          className="inline-block mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
