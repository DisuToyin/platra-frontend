import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInvitee, setIsInvitee] = useState(false)
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const inviteEmail = sessionStorage.getItem('inviteEmail');
    
    if (inviteEmail) {
      setIsInvitee(true)
      setEmail(inviteEmail);
    }
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await register(firstName, lastName, email, password, isInvitee);
      console.log({success, isInvitee})
      
      if (success && !isInvitee) {
        navigate('/verify');
      }else if (success && isInvitee) {
        const inviteToken = sessionStorage.getItem('inviteToken');
        const inviteAccepted = sessionStorage.getItem('inviteAccepted');

        if (inviteToken && inviteAccepted === 'true') {
          try {
            await completeInviteAfterRegistration(inviteToken);
          } catch (err) {
            console.error('Error completing invite:', err);
          }
          
          sessionStorage.removeItem('inviteToken');
          sessionStorage.removeItem('inviteEmail');
          sessionStorage.removeItem('inviteAccepted');
        }
        navigate('/businesses')
      }
       else {
        setError('An error occured');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeInviteAfterRegistration = async (token: string) => {
    console.log("completeInvite")
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/invites/${token}/complete`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to complete invitation');
      }
    } catch (error: any) {
      console.error('Error completing invite:', error);
      throw error;
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-xl border border-gray-200 p-8 mt-20">
        <h1 className='font-medium text-3xl'>Signup</h1>
        <p className='text-sm font-normal tracking-tighter text-gray-400 mb-10'>
          Welcome to platra!
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-sm font-normal rounded-sm">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className='flex gap-2'>
            <div>
                <label htmlFor="firstname" className="block text-sm font-normal tracking-tighter text-gray-700 mb-2">
                Firstname
                </label>
                <input
                id="firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                className="w-full px-4 py-3 text-sm font-normal tracking-tighter border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>


            <div>
                <label htmlFor="lastname" className="block text-sm font-normal tracking-tighter text-gray-700 mb-2">
                Lastname
                </label>
                <input
                id="lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                className="w-full px-4 py-3 text-sm font-normal tracking-tighter border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-normal tracking-tighter text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 text-sm font-normal tracking-tighter border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-normal tracking-tighter text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 text-sm font-normal tracking-tighter border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-normal tracking-tighter text-gray-700">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-sm font-normal tracking-tighter text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white text-sm font-normal tracking-tighter py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-normal tracking-tighter text-gray-600">
          Don't have an account?{' '}
          <button className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
            Sign up
          </button>
        </p>
      </div>

      <p className="mt-8 text-center text-sm font-normal tracking-tighter text-gray-500">
        © 2025 Platra. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;