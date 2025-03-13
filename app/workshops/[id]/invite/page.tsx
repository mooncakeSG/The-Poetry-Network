import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Workshop {
  id: string;
  title: string;
  description: string;
  isPrivate: boolean;
  maxMembers: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Invitation {
  id: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  user?: User;
}

export default function InvitePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workshopRes, invitationsRes] = await Promise.all([
          fetch(`/api/workshops/${params.id}`),
          fetch(`/api/workshops/${params.id}/invitations`),
        ]);

        if (!workshopRes.ok || !invitationsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [workshopData, invitationsData] = await Promise.all([
          workshopRes.json(),
          invitationsRes.json(),
        ]);

        setWorkshop(workshopData);
        setInvitations(invitationsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load workshop details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, toast]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to search users');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search users',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleInviteUser = async (userId: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/workshops/${params.id}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to send invitation');

      const newInvitation = await response.json();
      setInvitations(prev => [newInvitation, ...prev]);
      setSearchQuery('');
      setSearchResults([]);
      setShowUserSearch(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      const response = await fetch(`/api/workshops/${params.id}/invitations/${inviteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to revoke invitation');

      setInvitations(prev => prev.filter(invite => invite.id !== inviteId));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke invitation',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateInviteLink = async () => {
    try {
      const response = await fetch(`/api/workshops/${params.id}/invite-link`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to generate invite link');

      const { link } = await response.json();
      setInviteLink(link);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate invite link',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workshop) {
    return <div>Workshop not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Invite Members to {workshop.title}</h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Invite by Email</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <Button
                    onClick={() => handleInviteUser(user.id)}
                    disabled={isSubmitting}
                  >
                    Invite
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Invite Link</h2>
          <div className="flex gap-4">
            <Input
              value={inviteLink}
              readOnly
              className="flex-1"
            />
            <Button onClick={handleGenerateInviteLink}>
              Generate Link
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Invitations</h2>
          <div className="space-y-4">
            {invitations.map(invite => (
              <div key={invite.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <div className="font-medium">{invite.user?.name}</div>
                  <div className="text-sm text-gray-500">{invite.user?.email}</div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleRevokeInvite(invite.id)}
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 