import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, X, Loader2, Star } from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string | null;
  is_primary: boolean;
}

interface EmergencyContactsManagerProps {
  userId: string;
}

export function EmergencyContactsManager({ userId }: EmergencyContactsManagerProps) {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (userId) {
      loadContacts();
    }
  }, [userId]);

  const loadContacts = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('user_emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load emergency contacts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in name, phone, and relationship',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('user_emergency_contacts')
        .insert({
          user_id: userId,
          name: newContact.name,
          relationship: newContact.relationship,
          phone: newContact.phone,
          email: newContact.email || null,
          is_primary: contacts.length === 0,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Emergency contact added',
      });

      setNewContact({ name: '', relationship: '', phone: '', email: '' });
      await loadContacts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add contact',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('user_emergency_contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Contact removed',
      });

      await loadContacts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      });
    }
  };

  const handleSetPrimary = async (contactId: string) => {
    try {
      // Remove primary from all contacts
      await (supabase as any)
        .from('user_emergency_contacts')
        .update({ is_primary: false })
        .eq('user_id', userId);

      // Set new primary
      const { error } = await (supabase as any)
        .from('user_emergency_contacts')
        .update({ is_primary: true })
        .eq('id', contactId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Primary contact updated',
      });

      await loadContacts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update primary contact',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Emergency Contacts
        </CardTitle>
        <CardDescription>
          People to notify in case of emergency
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Contacts */}
        {contacts.length > 0 && (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{contact.name}</p>
                    {contact.is_primary && (
                      <Star className="w-4 h-4 fill-primary text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                  <p className="text-sm">{contact.phone}</p>
                  {contact.email && (
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!contact.is_primary && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetPrimary(contact.id)}
                    >
                      Set Primary
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Contact */}
        <div className="space-y-3 pt-4 border-t">
          <Label>Add Emergency Contact</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Relationship"
              value={newContact.relationship}
              onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
            />
            <Input
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Input
              placeholder="Email (optional)"
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <Button onClick={handleAddContact} disabled={saving} className="w-full">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

