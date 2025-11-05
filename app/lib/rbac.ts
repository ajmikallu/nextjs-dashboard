import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

/**
 * Get user with their role
 */
export async function getUserWithRole(email: string) {
  const result = await sql`
    SELECT 
      u.id, u.name, u.email, u.password, u.role_id,
      r.name as role_name, r.description as role_description
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.email = ${email}
  `;
  
  if (result.length === 0) return null;
  
  const user = result[0];
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role_id: user.role_id,
    role: {
      id: user.role_id,
      name: user.role_name,
      description: user.role_description,
    }
  };
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(email: string): Promise<string[]> {
  const result = await sql`
    SELECT p.name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    JOIN role_permissions rp ON r.id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE u.email = ${email}
  `;
  
  return result.map(row => row.name);
}

/**
 * Check if user has a specific permission
 */
export async function userHasPermission(
  email: string, 
  permission: string
): Promise<boolean> {
  const result = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM users u
      JOIN roles r ON u.role_id = r.id
      JOIN role_permissions rp ON r.id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE u.email = ${email} AND p.name = ${permission}
    ) as has_permission
  `;
  
  return result[0].has_permission;
}

/**
 * Check if user has permission for resource and action
 */
export async function canUserAccess(
  email: string,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): Promise<boolean> {
  const permissionName = `${resource}.${action}`;
  return userHasPermission(email, permissionName);
}

/**
 * Get user's role name
 */
export async function getUserRole(email: string): Promise<string | null> {
  const result = await sql`
    SELECT r.name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = ${email}
  `;
  
  return result.length > 0 ? result[0].name : null;
}
