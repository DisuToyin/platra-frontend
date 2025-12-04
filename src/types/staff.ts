export type OrganizationRole = 'manager' | 'service_staff' | 'delivery_staff' | 'kitchen_staff';

export interface StaffMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: OrganizationRole;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface StaffInvite {
  id: string;
  organization_id: string;
  email: string;
  token: string;
  name: string;
  role: OrganizationRole;
  expires_at: string;
  accepted: boolean;
  created_at: string;
  is_new_user: boolean;
  status: string;
}

export interface InviteFormData {
  name: string;
  email: string;
  role: OrganizationRole;
}