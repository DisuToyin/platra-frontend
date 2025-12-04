import { useSearchParams, Link } from "react-router-dom";

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-700">Payment Failed</h1>
        <p className="text-gray-600 mt-2">
          We could not verify your payment. If money was deducted, it will be reversed by your bank.
        </p>

        {reference && (
          <p className="mt-4 text-sm text-gray-500">
            Reference: <span className="font-mono">{reference}</span>
          </p>
        )}

        <Link
          to="/"
          className="inline-block mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailure;
