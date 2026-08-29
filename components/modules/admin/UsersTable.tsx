'use client';

import * as React from 'react';
import { UserProfile, UserRole } from '@/models/user/User';
import { InsetPanel } from '@/components/ui/molecules/InsetPanel';
import { Skeleton } from '@/components/ui/atoms/Skeleton';
import { Badge } from '@/components/ui/atoms/Badge';
import { Button } from '@/components/ui/atoms/Button';
import { formatMoney } from '@/helpers/format/formatMoney';
import { formatDateTime } from '@/helpers/format/formatDateTime';
import {
  useUpdateUserRoleMutation,
  useUpdateAgentPricingMutation,
} from '@/redux/api/adminApi';

export interface UsersTableProps {
  users: UserProfile[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  const [editingUserId, setEditingUserId] = React.useState<string | null>(null);
  const [ninPrice, setNinPrice] = React.useState<number>(300);
  const [bvnPrice, setBvnPrice] = React.useState<number>(300);

  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [updatePricing, { isLoading: isUpdatingPricing }] = useUpdateAgentPricingMutation();

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await updateRole({ userId, role: newRole });
  };

  const handleSavePricing = async (userId: string) => {
    await updatePricing({
      userId,
      agentNinPrice: ninPrice,
      agentBvnPrice: bvnPrice,
    });
    setEditingUserId(null);
  };

  const startEdit = (user: UserProfile) => {
    setEditingUserId(user.id);
    setNinPrice(user.agent_nin_price ?? 300);
    setBvnPrice(user.agent_bvn_price ?? 300);
  };

  return (
    <InsetPanel
      data-testid="admin-users-table-panel"
      footer={<span>Total registered portal users: {users.length}</span>}
    >
      {isLoading ? (
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center text-xs text-muted-foreground">
          No users found in database.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">User / Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Wallet</th>
                <th className="px-4 py-3">Agent NIN Price</th>
                <th className="px-4 py-3">Agent BVN Price</th>
                <th className="px-4 py-3">Joined Date</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((user) => {
                const isEditing = editingUserId === user.id;

                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-foreground">{user.full_name || '—'}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{user.email}</div>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        disabled={isUpdatingRole}
                        className="rounded-lg border border-border bg-card px-2 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        <option value="operator">Operator</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatMoney(user.wallet_balance)}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={ninPrice}
                          onChange={(e) => setNinPrice(Number(e.target.value))}
                          className="w-20 rounded-lg border border-border bg-card px-2 py-1 text-xs"
                        />
                      ) : (
                        <span className="font-mono text-xs">
                          {user.agent_nin_price !== undefined ? formatMoney(user.agent_nin_price) : 'Default (₦300)'}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={bvnPrice}
                          onChange={(e) => setBvnPrice(Number(e.target.value))}
                          className="w-20 rounded-lg border border-border bg-card px-2 py-1 text-xs"
                        />
                      ) : (
                        <span className="font-mono text-xs">
                          {user.agent_bvn_price !== undefined ? formatMoney(user.agent_bvn_price) : 'Default (₦300)'}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(user.created_at)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 px-2 text-[10px]"
                            onClick={() => handleSavePricing(user.id)}
                            isLoading={isUpdatingPricing}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[10px]"
                            onClick={() => setEditingUserId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[10px]"
                          onClick={() => startEdit(user)}
                        >
                          Edit Pricing
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </InsetPanel>
  );
}
