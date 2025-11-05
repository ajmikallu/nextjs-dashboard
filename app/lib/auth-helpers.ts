import { auth } from '@/auth';
import { getUserPermissions, canUserAccess } from './rbac';

/**
 * Get current user's session with permissions
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  
  const permissions = await getUserPermissions(session.user.email);
  
  return {
    ...session.user,
    permissions,
  };
}

/**
 * Check if current user can perform action
 */
export async function can(
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) return false;
  
  return canUserAccess(session.user.email, resource, action);
}

/**
 * Require permission or throw error
 */
export async function requirePermission(permission: string) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  if (!user.permissions.includes(permission)) {
    throw new Error('Forbidden: Insufficient permissions');
  }
}