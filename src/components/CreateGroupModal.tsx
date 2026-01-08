import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Group } from '@/types';
import { saveGroup, generateId, generateShareCode } from '@/utils/storage';

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  userId?: string;
}

const CreateGroupModal = ({ open, onClose, onCreated, userId }: CreateGroupModalProps) => {
  const [name, setName] = useState('');
  const [membersText, setMembersText] = useState('');
  const [includeYou, setIncludeYou] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const memberNames = membersText
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);
    
    if (includeYou && !memberNames.includes('You')) {
      memberNames.unshift('You');
    }
    
    if (memberNames.length < 2) return;

    const group: Group = {
      id: generateId(),
      name: name.trim(),
      members: memberNames,
      expenses: [],
      createdAt: Date.now(),
      shareCode: generateShareCode()
    };

    saveGroup(group, userId);
    onCreated();
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setMembersText('');
    setIncludeYou(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Group</DialogTitle>
          <DialogDescription>
            Enter the details for your new squad or trip to start splitting bills.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              placeholder="e.g., Goa Trip 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="members">Member Names</Label>
            <Textarea
              id="members"
              placeholder="Enter names separated by commas&#10;e.g., Rahul, Priya, Amit"
              value={membersText}
              onChange={(e) => setMembersText(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Separate names with commas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="includeYou"
              checked={includeYou}
              onCheckedChange={(checked) => setIncludeYou(checked as boolean)}
            />
            <Label htmlFor="includeYou" className="text-sm font-normal cursor-pointer">
              Include "You" as a member
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
