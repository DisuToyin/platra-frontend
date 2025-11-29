import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); 
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpCode }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Verification successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        setTimeLeft(300); // Reset timer to 5 minutes
        setSuccess('OTP resent successfully!');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="font-medium text-3xl mb-2">Verify Your Email</h1>
          <p className="text-sm font-normal tracking-tighter text-gray-400">
            We've sent a 6-digit code to your email
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="flex gap-2 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isVerifying || otp.join('').length !== 6}
            className="w-full bg-blue-600 text-white text-sm font-normal tracking-tighter py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </button>

          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-sm font-normal tracking-tighter text-gray-600">
                Resend code in{' '}
                <span className="font-medium text-blue-600">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-normal tracking-tighter text-blue-600 hover:text-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </form>

        <p className="mt-6 text-center text-sm font-normal tracking-tighter text-gray-600">
          Didn't receive the code?{' '}
          <button className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
            Check spam folder
          </button>
        </p>
      </div>

    </div>
  );
};

export default VerifyPage;