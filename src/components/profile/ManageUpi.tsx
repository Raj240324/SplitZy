import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Trash2, Smartphone, Plus, Check, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  createUserProfile, 
  getUserProfile, 
  addUpiId, 
  removeUpiId, 
  setPrimaryUpiId 
} from '@/services/user.service';
import { isValidUpiId } from '@/utils/payment';
import { UserProfile, UpiId } from '@/types';

export const ManageUpi = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUpi, setNewUpi] = useState({ vpa: '', label: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let p = await getUserProfile(user.id);
      if (!p) {
        // Init profile if not exists
        p = await createUserProfile({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          displayName: user.fullName || user.username || 'User',
          photoURL: user.imageUrl,
        });
      }
      setProfile(p);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error loading profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUpi = async () => {
    if (!user || !newUpi.vpa) return;
    if (!isValidUpiId(newUpi.vpa)) {
      toast({ title: 'Invalid UPI ID', description: 'Format should be username@bank', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      await addUpiId(user.id, {
        vpa: newUpi.vpa,
        label: newUpi.label || 'Personal',
      });
      await loadProfile();
      setIsAddOpen(false);
      setNewUpi({ vpa: '', label: '' });
      toast({ title: 'UPI ID Added' });
    } catch (error) {
      toast({ title: 'Failed to add UPI ID', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!user) return;
    try {
      await removeUpiId(user.id, id);
      await loadProfile();
      toast({ title: 'UPI ID Removed' });
    } catch (error) {
      toast({ title: 'Failed to remove', variant: 'destructive' });
    }
  };

  const handleSetPrimary = async (id: string) => {
    if (!user) return;
    try {
      await setPrimaryUpiId(user.id, id);
      await loadProfile();
      toast({ title: 'Primary UPI Updated' });
    } catch (error) {
       toast({ title: 'Failed to update', variant: 'destructive' });
    }
  };

  if(!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-primary" />
          UPI Settings
        </CardTitle>
        <CardDescription>
          Manage your UPI IDs for receiving payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-4 text-sm text-muted-foreground">Loading...</div>
        ) : (
          <>
            <div className="space-y-3">
              {profile?.upiIds.length === 0 && (
                 <p className="text-sm text-muted-foreground italic">No UPI IDs added yet.</p>
              )}
              
              {profile?.upiIds.map((upi) => (
                <div key={upi.id} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{upi.vpa}</span>
                      {upi.isPrimary && <Badge variant="secondary" className="text-xs">Primary</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{upi.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {!upi.isPrimary && (
                      <Button variant="ghost" size="sm" onClick={() => handleSetPrimary(upi.id)} title="Set as Primary">
                        <Star className="w-4 h-4 text-muted-foreground hover:text-yellow-500" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleRemove(upi.id)} title="Remove">
                      <Trash2 className="w-4 h-4 text-destructive opacity-70 hover:opacity-100" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" /> Add UPI ID
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New UPI ID</DialogTitle>
                  <DialogDescription>
                    Enter your UPI ID (e.g. username@okhdfcbank) to receive payments.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>UPI ID</Label>
                    <Input 
                      placeholder="username@bank" 
                      value={newUpi.vpa}
                      onChange={(e) => setNewUpi({ ...newUpi, vpa: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Label (Optional)</Label>
                    <Input 
                      placeholder="e.g. Personal, Business" 
                      value={newUpi.label}
                      onChange={(e) => setNewUpi({ ...newUpi, label: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddUpi} disabled={submitting || !newUpi.vpa}>
                    {submitting ? 'Adding...' : 'Add UPI ID'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  );
};
