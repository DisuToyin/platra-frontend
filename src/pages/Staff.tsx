import React, { useState, useEffect } from 'react';
import { Users, Mail, UserPlus, Trash2, Edit2,   Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Modal } from '@/components/ui/modal';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { StaffMember, StaffInvite, InviteFormData, OrganizationRole } from '@/types/staff'
import ErrorMessage from '@/components/Error';

const StaffManagementPage = () => {
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [invites, setInvites] = useState<StaffInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [inviteFormData, setInviteFormData] = useState<InviteFormData>({
    name: '',
    email: '',
    role: 'service_staff',
  });
  const [editRole, setEditRole] = useState<OrganizationRole>('service_staff');
  const [sendingInvite, setSendingInvite] = useState(false)
  const [error, setError] = useState<string>("")

  const roleOptions = [
    { value: 'manager', label: 'Manager', color: 'bg-purple-100 text-purple-800' },
    { value: 'service_staff', label: 'Service Staff', color: 'bg-blue-100 text-blue-800' },
    { value: 'delivery_staff', label: 'Delivery Staff', color: 'bg-green-100 text-green-800' },
    { value: 'kitchen_staff', label: 'Kitchen Staff', color: 'bg-orange-100 text-orange-800' },
  ];

  const statusConfig = {
  pending: {
    label: 'Pending',
    badgeColor: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    iconColor: 'bg-yellow-100 text-yellow-600',
  },
  accepted: {
    label: 'Accepted',
    badgeColor: 'bg-green-100 text-green-800 border border-green-200',
    iconColor: 'bg-green-100 text-green-600',
  },
  rejected: {
    label: 'Rejected',
    badgeColor: 'bg-red-100 text-red-800 border border-red-200',
    iconColor: 'bg-red-100 text-red-600',
  },
  expired: { // Optional: for expired pending invites
    label: 'Expired',
    badgeColor: 'bg-gray-100 text-gray-800 border border-gray-200',
    iconColor: 'bg-gray-100 text-gray-600',
  },
};

// Helper function to get status config
const getStatusConfig = (status: string, expired?: boolean) => {
  if (expired && status === 'pending') {
    return statusConfig.expired;
  }
  return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
};

// Helper function to get status badge
const getStatusBadge = (status: string, expired?: boolean) => {
  const config = getStatusConfig(status, expired);
  return (
    <Badge className={config.badgeColor}>
      {config.label}
    </Badge>
  );
};

// Helper function to get status icon
const getStatusIcon = (status: string, expired?: boolean) => {
  const config = getStatusConfig(status, expired);
  return (
    <div className={`rounded-full p-3 ${config.iconColor.split(' ')[0]}`}>
      <Mail className={`h-6 w-6 ${config.iconColor.split(' ')[1]}`} />
    </div>
  );
};


  useEffect(() => {
    if (user?.org_id) {
      fetchStaffData();
    }
  }, [user]);

  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      const staffResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/staff`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      console.log({staffResponse})

      if (staffResponse.ok) {
        const staffData = await staffResponse.json();
        if (staffData.success) {
          setStaffMembers(staffData.data || []);
        }
      } else {
        toast.error('Failed to fetch staff members');
      }

      // Fetch invites
      const invitesResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/invites`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (invitesResponse.ok) {
        const invitesData = await invitesResponse.json();
        if (invitesData.success) {
          setInvites(invitesData.data || []);
        }
      } else {
        toast.error('Failed to fetch invites');
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
      toast.error('Error loading staff data');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: OrganizationRole) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption?.color || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: OrganizationRole) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption?.label || role;
  };

  const handleSendInvite = async () => {
    setSendingInvite(true)
    if (!inviteFormData.name.trim() || !inviteFormData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/invites`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: inviteFormData.name,
            email: inviteFormData.email,
            role: inviteFormData.role,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Invitation sent successfully');
        setIsInviteModalOpen(false);
        setInviteFormData({ name: '', email: '', role: 'service_staff' });
        fetchStaffData(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to send invitation');
        setError(data.message)
      }
      setSendingInvite(false)
    } catch (error) {
      console.error('Error sending invite:', error);
      setError("Error sending invitation")
      toast.error('Error sending invitation');
      setSendingInvite(false)
    }
  };

  const handleOpenEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setEditRole(staff.role);
    setIsEditModalOpen(true);
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff || !user?.org_id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/staff/${editingStaff.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            role: editRole,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Staff role updated successfully');
        setIsEditModalOpen(false);
        setEditingStaff(null);
        fetchStaffData(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to update staff role');
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Error updating staff role');
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/staff/${staffId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Staff member removed successfully');
        fetchStaffData();
      } else {
        toast.error(data.message || 'Failed to remove staff member');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Error removing staff member');
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    if (!window.confirm('Are you sure you want to cancel this invitation?')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/invites/${inviteId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Invitation cancelled successfully');
        fetchStaffData(); 
      } else {
        toast.error(data.message || 'Failed to cancel invitation');
      }
    } catch (error) {
      console.error('Error cancelling invite:', error);
      toast.error('Error cancelling invitation');
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/invites/${inviteId}/resend`,
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
        toast.success('Invitation resent successfully');
        fetchStaffData(); // Refresh the list
      } else {
        toast.error(data.message || 'Failed to resend invitation');
      }
    } catch (error) {
      console.error('Error resending invite:', error);
      toast.error('Error resending invitation');
    }
  };

  const isInviteExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading staff data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 tracking-tighter">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your team members and pending invitations
            </p>
          </div>
          <Button 
            onClick={() => setIsInviteModalOpen(true)} 
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" />
            Invite Staff
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-4">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active">
              Active Staff ({staffMembers.length})
            </TabsTrigger>
            <TabsTrigger value="invites">
              Pending Invites ({invites.filter(i => !i.accepted).length})
            </TabsTrigger>
          </TabsList>

          {/* Active Staff Tab */}
          <TabsContent value="active" className="space-y-4">
            {staffMembers.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-4 mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Get started by inviting your first team member
                  </p>
                  <Button 
                    onClick={() => setIsInviteModalOpen(true)} 
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4" />
                    Invite Staff
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {staffMembers?.map(staff => (
                  <Card key={staff.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="rounded-full bg-blue-100 p-3">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                            <Badge className={getRoleBadgeColor(staff.role)}>
                              {getRoleLabel(staff.role)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {staff.email}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Joined {new Date(staff.created_at).toLocaleDateString()}</span>
                            {staff.updated_at !== staff.created_at && (
                              <span>Updated {new Date(staff.updated_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditModal(staff)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteStaff(staff.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Invites Tab */}
          <TabsContent value="invites" className="space-y-4">
            {invites.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <Mail className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending invitations</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    All invitations have been accepted or expired
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4">
                {invites.map(invite => {
  const expired = isInviteExpired(invite.expires_at);
  const status = invite.status;
  
  return (
    <Card key={invite.id} className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Status Icon */}
          {getStatusIcon(status, expired)}
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-gray-900">{invite.name}</h3>
              
              {/* Role Badge */}
              <Badge className={getRoleBadgeColor(invite.role)}>
                {getRoleLabel(invite.role)}
              </Badge>
              
              {/* Status Badge */}
              {getStatusBadge(status, expired)}
              
              {/* Role Badge (if you still want to show it) */}
              <Badge className={getRoleBadgeColor(invite.role)}>
                {getRoleLabel(invite.role)}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {invite.email}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Sent {new Date(invite.created_at).toLocaleDateString()}</span>
              <span>
                {expired ? 'Expired' : 'Expires'} {new Date(invite.expires_at).toLocaleDateString()}
              </span>
              {invite.is_new_user && <span className="text-blue-600">New User</span>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {status === 'pending' && !expired && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResendInvite(invite.id)}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              Resend
            </Button>
          )}
          {status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancelInvite(invite.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
})}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Invite Staff Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Staff Member"
        description="Send an invitation to add a new team member to your organization"
        size="md"
      >
        {<ErrorMessage error={error}/>}
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="e.g., John Doe"
              value={inviteFormData.name}
              onChange={(e) => setInviteFormData({ ...inviteFormData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g., john@example.com"
              value={inviteFormData.email}
              onChange={(e) => setInviteFormData({ ...inviteFormData, email: e.target.value })}
            />
            <p className="text-xs text-gray-500">
              An invitation will be sent to this email address
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={inviteFormData.role}
              onValueChange={(value) => setInviteFormData({ ...inviteFormData, role: value as OrganizationRole })}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Select the role for this team member
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsInviteModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              disabled={sendingInvite}
              onClick={handleSendInvite} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Staff Member"
        description="Update the role for this team member"
        size="md"
      >
        <div className="space-y-6 py-4">
          {editingStaff && (
            <>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={editingStaff.name} disabled />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editingStaff.email} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role *</Label>
                <Select
                  value={editRole}
                  onValueChange={(value) => setEditRole(value as OrganizationRole)}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateStaff} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Update Role
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default StaffManagementPage;