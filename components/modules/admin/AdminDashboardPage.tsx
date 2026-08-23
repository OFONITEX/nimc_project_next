'use client';

import * as React from 'react';
import Link from 'next/link';
import { Crown, Lock, UserPlus, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { useGetAdminUsersQuery } from '@/redux/api/adminApi';
import { supabase } from '@/lib/supabase/client';
import { AddAgentFormValues } from '@/schemas/admin';
import { Card } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { ContentWidthContainer } from '@/components/ui/molecules/ContentWidthContainer';
import { UsersTable } from './UsersTable';
import { AddAgentForm } from './AddAgentForm';

export function AdminDashboardPage() {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const { data: users = [], isLoading, refetch } = useGetAdminUsersQuery();

  const [statusMessage, setStatusMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const isAdmin = currentUser && (currentUser.email === 'brinoekanem@gmail.com' || currentUser.role === 'admin');

  if (!isAdmin) {
    return (
      <ContentWidthContainer variant="narrow" className="py-12">
        <Card className="p-8 text-center shadow-card border border-border">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <Lock className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Access Restricted</h3>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            This Admin &amp; Agent Management Portal is reserved exclusively for the primary administrator (
            <strong>brinoekanem@gmail.com</strong>).
          </p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button variant="default">Return to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </ContentWidthContainer>
    );
  }

  const handleAddOrUpdateAgent = async (values: AddAgentFormValues) => {
    setIsSaving(true);
    setStatusMessage(null);

    try {
      // Find user by email
      const { data: userProfile, error: findError } = await supabase
        .from('users')
        .select('id')
        .eq('email', values.email.trim())
        .single();

      if (findError || !userProfile) {
        setStatusMessage({
          text: `User with email "${values.email}" not found in database. User must sign up first.`,
          type: 'error',
        });
        setIsSaving(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: values.role,
          agent_nin_price: values.agentNinPrice,
          agent_bvn_price: values.agentBvnPrice,
        })
        .eq('id', userProfile.id);

      if (updateError) {
        setStatusMessage({ text: updateError.message, type: 'error' });
      } else {
        setStatusMessage({
          text: `Successfully updated role and pricing for ${values.email}!`,
          type: 'success',
        });
        refetch();
      }
    } catch {
      setStatusMessage({ text: 'Network error updating agent profile', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ContentWidthContainer variant="full" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-500 shrink-0" />
            Admin &amp; Agent Management Portal
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure agent roles, set custom lookup pricing, and manage registered operators.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs ${
            statusMessage.type === 'success'
              ? 'border-success/20 bg-success-light/60 text-success'
              : 'border-destructive/20 bg-destructive-light/60 text-destructive'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Add / Upgrade Agent Card */}
      <Card className="p-6 border-t-4 border-t-purple-600 shadow-card">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/60">
          <UserPlus className="h-5 w-5 text-purple-600" />
          <h3 className="text-sm font-bold text-foreground">
            Assign Agent Role &amp; Custom Pricing
          </h3>
        </div>
        <AddAgentForm onSubmit={handleAddOrUpdateAgent} isLoading={isSaving} />
      </Card>

      {/* Users Roster Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Registered Portal Users &amp; Agents
          </h3>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs">
            Refresh Roster
          </Button>
        </div>
        <UsersTable users={users} isLoading={isLoading} />
      </div>
    </ContentWidthContainer>
  );
}
