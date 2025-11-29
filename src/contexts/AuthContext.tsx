import React, { createContext,  useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  organization_name?: string;
  org_id?: string;
  display_name: string;
}

interface Organization {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  currency: string;
}


interface AuthContextType {
  user: User | null;
  loading: boolean;
  organizationsLoading: boolean;
  selectedOrganization: Organization | null;
  organizations: Organization[];
  login: (email: string, password: string) => Promise<any>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchOrganizations: () => Promise<void>;
  selectOrganization: (orgId: string) => Promise<any>;
  clearOrganization: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState(false);


  const checkAuth = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Important for httpOnly cookies
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          display_name: firstName + ' ' + lastName, 
          email, 
          password 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register failed:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string;}> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
      
      if (res.ok) {
        setUser(data.data);
        return { success: true};
      } else {
        return { 
          success: false, 
          error: data.message || data.error || 'Login failed' 
        };
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error || error?.message || 'Network err'
      }; 
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
    }
  };


  const fetchOrganizations = async () => {
    
    setOrganizationsLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/organizations`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        // console.log({authcon: data.data})
        setOrganizations(data.data);
      }

      setOrganizationsLoading(false)
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      setOrganizationsLoading(false)
    }
  };

  const selectOrganization = async (orgId: string) => {
    // console.log("SELECTED ORGS CLICKED!")
    const org = organizations.find(o => o.id === orgId);


    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/organizations/${org?.id}/select`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      // console.log({res})

      if (res.ok) {
        const data = await res.json();
        // console.log({authcon: data})
        setUser((prev: any) => ({
          ...prev,
          organization_name: org?.name,
          org_id: org?.id,
        }));

        setSelectedOrganization(data)
        return true
      }

      setOrganizationsLoading(false)
      return false
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      setOrganizationsLoading(false)
    }
  };

  const clearOrganization = () => {
    setSelectedOrganization(null);
    localStorage.removeItem('selectedOrganization');
  };



  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth, organizations,  
      fetchOrganizations,
      selectOrganization,
      organizationsLoading,
      selectedOrganization,
      clearOrganization }}>
      {children}
    </AuthContext.Provider>
  );
};

