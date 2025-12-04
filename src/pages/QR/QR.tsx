import React, { useState, useEffect } from 'react';
import { QrCode, Plus, Edit2, Trash2, Download, Power, PowerOff, Loader2, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import ErrorMessage from '@/components/Error';


interface QRCode {
  id: string;
  scan_point: string;
  redirect_url: string;
  qr_image_base64?: string;
  business_type?: string;
  capacity: number;
  is_active: boolean;
  external_id?: string;
  created_at: string;
  organization_id: string;
}

interface QRFormData {
  scan_point: string;
  capacity: number;
  business_type: string;
  is_active: boolean;
}

const QRCodesPage = () => {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQR, setEditingQR] = useState<QRCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<QRFormData>({
    scan_point: '',
    capacity: 2,
    business_type: 'restaurant',
    is_active: true,
  });

  const [error, setError] = useState<string | null>(null)
  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'other', label: 'Other' },
  ];

  // Fetch QR codes on component mount
  useEffect(() => {
    fetchQRCodes();
  }, []);

  const fetchQRCodes = async () => {
    if (!user?.org_id) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/qr`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (res.ok) {
        const data = await res.json();
        setQrCodes(data.data || []);
      } else {
        toast.error('Failed to fetch QR codes');
      }
    } catch (error: any) {
      console.error('Error fetching QR codes:', error);
      setError(`Error fetching QR codes ${error?.message || error?.error || error}`)
    //   toast.error('Error fetching QR codes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (qr?: QRCode) => {
    if (qr) {
      setEditingQR(qr);
      setFormData({
        scan_point: qr.scan_point,
        capacity: qr.capacity,
        business_type: qr.business_type || 'restaurant',
        is_active: qr.is_active,
      });
    } else {
      setEditingQR(null);
      setFormData({
        scan_point: '',
        capacity: 2,
        business_type: 'restaurant',
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQR(null);
  };

  const handleSubmit = async () => {
    if (!formData.scan_point.trim()) {
      toast.error('Scan point is required');
      return;
    }

    if (!user?.org_id) {
      toast.error('Organization ID not found');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingQR) {
        await updateQRCode(editingQR.id);
      } else {
        await createQRCode();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const createQRCode = async () => {
    const payload = {
      scan_point: formData.scan_point,
      capacity: formData.capacity,
      business_type: formData.business_type,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/qr`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success('QR code created successfully');
        fetchQRCodes();
        handleCloseModal();
      } else {
        toast.error(data.message || 'Failed to create QR code');
        setError(data.message || 'Failed to create QR code' )
      }
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast.error('Error creating QR code');
      setError('Error creating QR code')
    }
  };

  const updateQRCode = async (qrId: string) => {
    const payload = {
      scan_point: formData.scan_point,
      capacity: formData.capacity,
      business_type: formData.business_type,
      is_active: formData.is_active,
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user?.org_id}/qr/${qrId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success('QR code updated successfully');
        fetchQRCodes();
        handleCloseModal();
      } else {
        toast.error(data.message || 'Failed to update QR code');
        setError(data.message || 'Failed to update QR code')
      }
    } catch (error) {
      console.error('Error updating QR code:', error);
      setError(`Error updating QR code: ${error}`)
      toast.error('Error updating QR code');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) {
      return;
    }

    if (!user?.org_id) {
      toast.error('Organization ID not found');
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user.org_id}/qr/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (res.ok) {
        toast.success('QR code deleted successfully');
        fetchQRCodes();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete QR code');
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Error deleting QR code');
    }
  };

  const handleToggleActive = async (qr: QRCode) => {
    if (!user?.org_id) {
      toast.error('Organization ID not found');
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/organizations/${user.org_id}/qr/${qr.id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scan_point: qr.scan_point,
            capacity: qr.capacity,
            business_type: qr.business_type,
            is_active: !qr.is_active,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(`QR code ${!qr.is_active ? 'activated' : 'deactivated'} successfully`);
        fetchQRCodes();
      } else {
        toast.error(data.message || 'Failed to update QR code status');
      }
    } catch (error) {
      console.error('Error toggling QR code active status:', error);
      toast.error('Error updating QR code status');
    }
  };

  const handleDownload = (qr: QRCode) => {
    // This would need backend support to generate downloadable QR code
    toast.info('Download feature coming soon');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading QR codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-sm tracking-tighter">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">QR Codes</h1>
            <p className="mt-1 text-gray-500">
              Manage your QR codes for customers to scan and access your menu
            </p>
          </div>
          <Button onClick={() => handleOpenModal()} className="gap-2 bg-blue-600">
            <Plus className="h-4 w-4" />
            Create QR Code
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6">
        {qrCodes.length === 0 ? (
            <div className="flex flex-col items-center pt-20">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes yet</h3>
              <p className="text-sm text-gray-600 mb-6">
                Get started by creating your first QR code
              </p>
              <Button onClick={() => handleOpenModal()} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Create QR Code
              </Button>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map(qr => (
            <Card className="p-5">
                <div className='space-y-2 border-b border-b-gray-200 pb-4'>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{qr.scan_point}</h3>
                        
                         <div className="flex items-center gap-2 justify-right">
                            <button
                                onClick={() => handleOpenModal(qr)}
                                className="p-1.5 hover:bg-gray-100 rounded transition-colors "
                            >
                                <Edit2 className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                                onClick={() => handleDelete(qr.id)}
                                className="p-1.5 hover:bg-red-50 rounded transition-colors "
                            >
                                <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>Capacity: {qr.capacity} guests</span>
                        </div>
                        {qr.business_type && (
                        <div className="flex items-center gap-1.5 capitalize">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>{qr.business_type}</span>
                        </div>
                        )}
                    </div>
                </div>

                

                {/* QR Code Section */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                    <QrCode className="h-4 w-4 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">QR Code</span>
                    </div>
                    
                    <div className="flex items-start gap-4">
                    {qr.qr_image_base64 ? (
                        <div className="border border-gray-200 rounded-md p-2 bg-white">
                        <img 
                            src={`${qr.qr_image_base64}`} 
                            alt={`QR Code for ${qr.scan_point}`}
                            className="h-28 w-28"
                        />
                        </div>
                    ) : (
                        <div className="border border-gray-200 rounded-md p-8 bg-gray-50">
                        <QrCode className="h-28 w-28 text-gray-300" />
                        </div>
                    )}

                    <div className="flex-1 flex flex-col gap-2">
                        <Button
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2 text-gray-700 w-full text-xs font-medium"
                        onClick={() => handleDownload(qr)}
                        >
                        <Download className="h-3 w-3" />
                        Download QR
                        </Button>
                        
                        <button
                        onClick={() => handleToggleActive(qr)}
                        className={`flex items-center justify-start gap-2 px-3 py-1.5  font-medium rounded-md border transition-colors w-full text-xs font-medium${
                            qr.is_active 
                            ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' 
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        >
                        {qr.is_active ? (
                            <>
                            <Power className="h-3 w-3" />
                            <span>Active</span>
                            </>
                        ) : (
                            <>
                            <PowerOff className="h-3 w-3" />
                            <span>Inactive</span>
                            </>
                        )}
                        </button>

                    </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Redirect URL</span>
                    <a 
                        href={qr.redirect_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <span>View</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                        Created {new Date(qr.created_at).toLocaleDateString()}
                       
                    </div>
                </div>
                </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingQR ? 'Edit QR Code' : 'Create QR Code'}
        description={editingQR ? 'Update your QR code details' : 'Generate a new QR code for customers to scan'}
        size="md"
      >
        {error && <ErrorMessage error={error} />}

        <div className="space-y-6 ">
          <div className="">
            <Label htmlFor="scan_point" className="mb-2">Scan Point *</Label>
            <Input
              id="scan_point"
              placeholder="e.g., Table 1, Room 2"
              value={formData.scan_point}
              onChange={(e) => setFormData({ ...formData, scan_point: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">
              Where this QR code will be physically placed
            </p>
          </div>

          <div className='flex gap-3'>
            <div className="space-y-2 w-full">
              <Label htmlFor="business_type">Business Type</Label>
              <Select
                value={formData.business_type}
                onValueChange={(value) => setFormData({ ...formData, business_type: value })}
              >
                <SelectTrigger id="business_type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Label htmlFor="capacity" className='mb-2'>Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 2 })}
              />
              <p className="text-xs text-gray-400 mt-1">
                Number of people this location can accommodate
              </p>
            </div>
          </div>

          {editingQR && (
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Active Status</Label>
                <p className="text-xs text-gray-500">
                  Enable or disable this QR code
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCloseModal} 
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingQR ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                `${editingQR ? 'Update' : 'Create'} QR Code`
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QRCodesPage;