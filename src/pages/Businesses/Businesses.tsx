import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Plus, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ErrorMessage from '@/components/Error';

const Businesses = () => {
  const {fetchOrganizations, organizations, selectOrganization, organizationsLoading} = useAuth()
  const navigate = useNavigate();
  const [error, setError] = useState<string>()
  // console.log(organizations)

  useEffect(() => {
    fetchOrganizations()
  }, []);


  const handleSelectBusiness = async (orgId: string) => {

    const res = await selectOrganization(orgId);
    if(res == true ){
      navigate('/dashboard');
    }else{
      setError("Failed to select an organization - Please try again later")
      console.log("FAILED TO SELECT")
    }
  };

  const handleCreateNew = () => {
    navigate('/business/create');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  if (organizationsLoading) {
    return (
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-xl border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-sm font-normal tracking-tighter text-gray-600">
              Loading your businesses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="mb-8">
          <h1 className="font-medium text-3xl mb-2">Select a Business</h1>
          <p className="text-sm font-normal tracking-tighter text-gray-400">
            Choose a business to continue
          </p>
        </div>
        {error && <ErrorMessage error={error}/>}
          <>
            <div className="space-y-3 mb-6">
              {organizations?.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleSelectBusiness(org.id)}
                  disabled={!org.is_active}
                  className={`w-full p-4 border rounded-lg text-left transition-all flex items-center gap-4 group ${
                    org.is_active
                      ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="shrink-0">
                    {org.logo_url ? (
                      <img
                        src={org.logo_url}
                        alt={org.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {getInitials(org.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-lg text-gray-900 truncate">
                        {org.name}
                      </h3>
                      {!org.is_active && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    {org.description && (
                      <p className="text-sm font-normal tracking-tighter text-gray-500 truncate mb-1">
                        {org.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {org.email && <span>{org.email}</span>}
                      {org.phone && <span>• {org.phone}</span>}
                    </div>
                  </div>

                  {org.is_active && (
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleCreateNew}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm font-normal tracking-tighter text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Create New Business
            </button>
          </>
    
      </div>

  
    </div>
  );
};

export default Businesses;