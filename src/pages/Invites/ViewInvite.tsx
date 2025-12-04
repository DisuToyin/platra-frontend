import ErrorMessage from '@/components/Error';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Invite {
  id: string;
  email: string;
  role: string;
  organizationId: string;
  isNewUser: boolean;
  expiresAt: string;
}

interface Organization {
  id: string;
  name: string;
  description?: string;
}

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface VerifyResponse {
  invite: Invite;
  organization: Organization;
  isNewUser: boolean;
  user?: User;
}

type InviteStatus = 'loading' | 'valid' | 'expired' | 'notFound' | 'alreadyUsed' | 'error';

const AcceptInvitePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  console.log({token})
  const navigate = useNavigate();

  const [status, setStatus] = useState<InviteStatus>('loading');
  const [inviteData, setInviteData] = useState<VerifyResponse | null>(null);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    verifyInvite();
  }, [token]);

 const verifyInvite = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/invites/${token}/verify`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    console.log({response})
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success) {
        setInviteData(data.data);
        setStatus('valid');
      } else {
        // Handle API success: false case
        setStatus('error');
        setErrorMessage(data.message || 'Invitation verification failed');
      }
    } else {
      // Handle HTTP error status
      const errorData = await response.json();
      const message = errorData.message || response.statusText;
      
      if (message.includes('expired')) {
        setStatus('expired');
      } else if (message.includes('not found')) {
        setStatus('notFound');
      } else if (message.includes('already')) {
        setStatus('alreadyUsed');
      } else {
        setStatus('error');
        setErrorMessage(message);
      }
    }
  } catch (error: any) {
    setStatus('error');
    setErrorMessage('Failed to verify invitation - network error');
  }
};

const handleAccept = async () => {
  setProcessing(true);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/invites/${token}/accept`,
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
      // Store token in session storage for registration/login
      sessionStorage.setItem('inviteToken', token!);
      sessionStorage.setItem('inviteAccepted', 'true');
      
      if (data.data.isNewUser) {
        // New user - redirect to registration with email pre-filled
        sessionStorage.setItem('inviteEmail', data.data.email);
        navigate('/register', { 
          state: { 
            email: data.data.email,
            inviteToken: token 
          } 
        });
      } else {
        // Existing user - redirect to login
        navigate('/login', { 
          state: { 
            message: 'Invitation accepted! Please login to access your organization.',
            inviteToken: token 
          } 
        });
      }
    } else {
      // Handle API error
      setErrorMessage(
        data.message || 'Failed to accept invitation'
      );
    }
  } catch (error: any) {
    setErrorMessage('Failed to accept invitation - network error');
  } finally {
    setProcessing(false);
  }
};

const handleReject = async () => {
  if (!window.confirm('Are you sure you want to reject this invitation?')) {
    return;
  }

  setProcessing(true);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/invites/${token}/reject`,
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
      navigate('/', { 
        state: { 
          message: 'Invitation rejected' 
        } 
      });
    } else {
      setErrorMessage(
        data.message || 'Failed to reject invitation'
      );
    }
  } catch (error: any) {
    setErrorMessage('Failed to reject invitation - network error');
  } finally {
    setProcessing(false);
  }
};

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-md p-8 border border-gray-200 text-center text-sm tracking-tighter">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invitation Expired</h1>
          <p className="text-gray-600 mb-6">This invitation has expired. Please contact the organization administrator for a new invitation.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (status === 'notFound') {
    return (
      <div className="min-h-screen flex items-center justify-center  px-4">
        <div className="max-w-md w-full bg-white rounded-md p-8 border border-gray-200 text-center text-sm tracking-tighter">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invitation Not Found</h1>
          <p className="text-gray-600 mb-6">This invitation link is invalid or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (status === 'alreadyUsed') {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm tracking-tighter  px-4">
        <div className="max-w-md w-full bg-white rounded-md p-8 text-center border border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Already Accepted</h1>
          <p className="text-gray-600 mb-6">This invitation has already been accepted.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm tracking-tighter px-4">
        <div className="max-w-md w-full bg-white rounded-md border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{errorMessage || 'An error occurred while processing your invitation.'}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-sm tracking-tighter">
      <div className="max-w-lg w-full bg-white rounded-md border border-gray-200 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You've been invited to join {inviteData?.organization.name}</h1>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {inviteData?.organization.name}
          </h2>
          {inviteData?.organization.description && (
            <p className="text-gray-600 mb-4">{inviteData.organization.description}</p>
          )}
          
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-gray-500 font-medium w-24">Email:</span>
              <span className="text-gray-900">{inviteData?.invite.email}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-500 font-medium w-24">Role:</span>
              <span className="text-gray-900 capitalize">{inviteData?.invite.role}</span>
            </div>
            {!inviteData?.isNewUser && inviteData?.user && (
              <div className="flex items-start">
                <span className="text-gray-500 font-medium w-24">Account:</span>
                <span className="text-gray-900">{inviteData.user.displayName}</span>
              </div>
            )}
            {inviteData?.isNewUser && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                <p className="text-sm text-blue-800">
                  You are a new user, after accepting, you'll be redirected to create your account.
                </p>
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <ErrorMessage error={errorMessage}/>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleReject}
            disabled={processing}
            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            disabled={processing}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : 'Accept Invitation'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          By accepting this invitation, you agree to join this organization with the specified role.
        </p>
      </div>
    </div>
  );
};

export default AcceptInvitePage;