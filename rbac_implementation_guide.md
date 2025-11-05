# RBAC Implementation Guide

## 📋 Step-by-Step Setup

### Step 1: Run SQL Schema in Supabase
1. Go to Supabase Dashboard → SQL Editor
2. Copy all SQL from "Scalable RBAC Database Schema" artifact
3. Run it to create tables, roles, and permissions
4. Verify tables created: `roles`, `permissions`, `role_permissions`

### Step 2: Update Your Code Files

**Add to `app/lib/definitions.ts`:**
- Role, Permission, and updated User types

**Create `app/lib/rbac.ts`:**
- Helper functions for permission checking
- Database queries for roles and permissions

**Update `auth.ts`:**
- Include role in user session
- Use `getUserWithRole()` instead of `getUser()`

**Create `app/lib/auth-helpers.ts`:**
- `getCurrentUser()` - Get user with permissions
- `can()` - Check if user can perform action
- `requirePermission()` - Throw error if no permission

### Step 3: Protect Your Routes

**In Server Actions:**
```typescript
export async function createInvoice(formData: FormData) {
  await requirePermission('invoices.create');
  // ... rest of your code
}
```

**In Page Components:**
```typescript
export default async function InvoicesPage() {
  const canCreate = await can('invoices', 'create');
  
  return (
    <div>
      {canCreate && <CreateButton />}
    </div>
  );
}
```

**In API Routes:**
```typescript
export async function GET(request: NextRequest) {
  const session = await auth();
  const canRead = await canUserAccess(session.user.email, 'invoices', 'read');
  
  if (!canRead) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // ... return data
}
```

## 🎭 Understanding the Roles

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Admin** | Everything | System administrator |
| **Manager** | All except user management | Department manager |
| **Editor** | Read all, edit invoices/customers | Content editor |
| **Viewer** | Read only | Stakeholder, observer |

## 🔑 Permission Naming Convention

Format: `resource.action`

Examples:
- `invoices.create` - Can create invoices
- `invoices.read` - Can view invoices
- `invoices.update` - Can edit invoices
- `invoices.delete` - Can delete invoices
- `customers.read` - Can view customers
- `users.create` - Can create new users

## 📊 Database Structure

```
users
├── role_id → roles
                ├── role_permissions → permissions
                                        ├── resource (invoices, customers, users)
                                        └── action (create, read, update, delete)
```

## 🧪 Testing Your RBAC

### Test in Supabase SQL Editor:

```sql
-- Check user's permissions
SELECT * FROM get_user_permissions('user@nextmail.com');

-- Check if user has specific permission
SELECT user_has_permission('user@nextmail.com', 'invoices.create');

-- See all role permissions
SELECT * FROM role_permissions_view;

-- See all user permissions
SELECT * FROM user_permissions_view WHERE email = 'user@nextmail.com';
```

### Test in Your App:

1. **Login with test user** (`user@nextmail.com` / `123456`)
2. **Check their role** is admin (you set this in SQL)
3. **Try accessing** different features
4. **Change their role** in Supabase to 'viewer'
5. **Refresh and test** - should lose some access

## 🔒 Security Best Practices

### ✅ DO:
- Always check permissions on the server side
- Use `requirePermission()` in server actions
- Check `can()` before showing UI elements
- Validate permissions in API routes

### ❌ DON'T:
- Only hide UI (always check server-side too)
- Trust client-side permission checks
- Skip permission checks in API routes
- Hard-code role names everywhere (use the database)

## 📝 Common Use Cases

### 1. Hide Create Button for Viewers
```typescript
const canCreate = await can('invoices', 'create');
{canCreate && <CreateInvoiceButton />}
```

### 2. Disable Edit for Viewers
```typescript
const canUpdate = await can('invoices', 'update');
<input disabled={!canUpdate} />
```

### 3. Show Different Dashboard for Each Role
```typescript
const user = await getCurrentUser();

if (user?.role === 'admin') {
  return <AdminDashboard />;
}
return <UserDashboard />;
```

### 4. Protect Entire Page
```typescript
// app/dashboard/admin/page.tsx
export default async function AdminPage() {
  await requirePermission('users.read');
  return <div>Admin Only Content</div>;
}
```

## 🚀 Adding New Permissions

When you add a new feature:

1. **Add permission to database:**
```sql
INSERT INTO permissions (name, resource, action, description) VALUES
  ('reports.create', 'reports', 'create', 'Create reports');
```

2. **Assign to roles:**
```sql
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin' AND p.name = 'reports.create';
```

3. **Use in code:**
```typescript
await requirePermission('reports.create');
```

## 🔄 Changing User Roles

```sql
-- Make user a manager
UPDATE users 
SET role_id = (SELECT id FROM roles WHERE name = 'manager')
WHERE email = 'john@example.com';
```

## 📱 Display Role Badge

```typescript
// Show user's role in UI
<span className="badge">
  {session?.user?.role}
</span>
```

## 🎯 Quick Reference

| Task | Code |
|------|------|
| Get current user | `await getCurrentUser()` |
| Check permission | `await can('invoices', 'create')` |
| Require permission | `await requirePermission('invoices.delete')` |
| Get user role | `await getUserRole(email)` |
| Check in API | `await canUserAccess(email, 'invoices', 'read')` |

## 🐛 Troubleshooting

**"User doesn't have permission" error:**
- Check role is assigned: `SELECT * FROM users WHERE email = 'user@example.com'`
- Check role has permission: `SELECT * FROM role_permissions_view WHERE role_name = 'admin'`
- Verify permission exists: `SELECT * FROM permissions WHERE name = 'invoices.create'`

**Session doesn't have role:**
- Sign out and sign in again
- Check `auth.ts` callbacks include role
- Verify JWT token has role field