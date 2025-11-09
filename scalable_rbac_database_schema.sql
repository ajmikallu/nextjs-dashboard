-- ============================================
-- SCALABLE RBAC DATABASE SCHEMA FOR SUPABASE
-- ============================================

-- Run these in Supabase SQL Editor

-- ============================================
-- 1. ROLES TABLE
-- ============================================
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Full system access'),
  ('manager', 'Can manage users and content'),
  ('editor', 'Can edit content'),
  ('viewer', 'Read-only access');


-- ============================================
-- 2. PERMISSIONS TABLE
-- ============================================
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  resource VARCHAR(50) NOT NULL, -- e.g., 'invoices', 'customers', 'users'
  action VARCHAR(50) NOT NULL,   -- e.g., 'create', 'read', 'update', 'delete'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert common permissions
INSERT INTO permissions (name, resource, action, description) VALUES
  -- Invoices
  ('invoices.create', 'invoices', 'create', 'Create new invoices'),
  ('invoices.read', 'invoices', 'read', 'View invoices'),
  ('invoices.update', 'invoices', 'update', 'Edit invoices'),
  ('invoices.delete', 'invoices', 'delete', 'Delete invoices'),
  
  -- Customers
  ('customers.create', 'customers', 'create', 'Create new customers'),
  ('customers.read', 'customers', 'read', 'View customers'),
  ('customers.update', 'customers', 'update', 'Edit customers'),
  ('customers.delete', 'customers', 'delete', 'Delete customers'),
  
  -- Users
  ('users.create', 'users', 'create', 'Create new users'),
  ('users.read', 'users', 'read', 'View users'),
  ('users.update', 'users', 'update', 'Edit users'),
  ('users.delete', 'users', 'delete', 'Delete users'),
  
  -- Dashboard
  ('dashboard.view', 'dashboard', 'read', 'View dashboard');


-- ============================================
-- 3. ROLE_PERMISSIONS (Many-to-Many)
-- ============================================
CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- Assign permissions to roles
-- Admin: All permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin';

-- Manager: All except user management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'manager'
  AND p.name NOT LIKE 'users.%';

-- Editor: Read all, edit invoices and customers
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'editor'
  AND (p.action = 'read' OR p.name IN ('invoices.update', 'customers.update'));

-- Viewer: Read only
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'viewer'
  AND p.action = 'read';


-- ============================================
-- 4. UPDATE USERS TABLE
-- ============================================
-- Add role_id to existing users table
ALTER TABLE users 
ADD COLUMN role_id UUID REFERENCES roles(id);

-- Set default role for existing users (viewer)
UPDATE users 
SET role_id = (SELECT id FROM roles WHERE name = 'viewer')
WHERE role_id IS NULL;

-- Make role_id required for new users
ALTER TABLE users 
ALTER COLUMN role_id SET NOT NULL;

-- Set your test user as admin
UPDATE users 
SET role_id = (SELECT id FROM roles WHERE name = 'admin')
WHERE email = 'user@nextmail.com';


-- ============================================
-- 5. USEFUL VIEWS
-- ============================================

-- View to see all role permissions
CREATE VIEW role_permissions_view AS
SELECT 
  r.name as role_name,
  p.name as permission_name,
  p.resource,
  p.action
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
ORDER BY r.name, p.resource, p.action;

-- View to see user permissions
CREATE VIEW user_permissions_view AS
SELECT 
  u.id as user_id,
  u.email,
  u.name,
  r.name as role_name,
  p.name as permission_name,
  p.resource,
  p.action
FROM users u
JOIN roles r ON u.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
ORDER BY u.email, p.resource, p.action;


-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(
  user_email TEXT,
  permission_name TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users u
    JOIN roles r ON u.role_id = r.id
    JOIN role_permissions rp ON r.id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE u.email = user_email
      AND p.name = permission_name
  );
END;
$$ LANGUAGE plpgsql;

-- Usage: SELECT user_has_permission('user@nextmail.com', 'invoices.create');


-- Function to get all user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_email TEXT)
RETURNS TABLE (
  permission_name TEXT,
  resource TEXT,
  action TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.name::TEXT,
    p.resource::TEXT,
    p.action::TEXT
  FROM users u
  JOIN roles r ON u.role_id = r.id
  JOIN role_permissions rp ON r.id = rp.role_id
  JOIN permissions p ON rp.permission_id = p.id
  WHERE u.email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Usage: SELECT * FROM get_user_permissions('user@nextmail.com');


-- ============================================
-- 7. ROW LEVEL SECURITY (RLS) - Optional but Recommended
-- ============================================

-- Enable RLS on tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read roles and permissions
CREATE POLICY "Allow read access to roles" ON roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to permissions" ON permissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read access to role_permissions" ON role_permissions
  FOR SELECT TO authenticated USING (true);


-- ============================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX idx_permissions_resource ON permissions(resource);
CREATE INDEX idx_permissions_action ON permissions(action);

-- ============================================
-- 9. POSTS TABLE
-- ===========================================
create table posts (
  id bigint primary key generated always as identity,
  title text not null,
  content text not null,
  excerpt text,
  author text,
  created_at timestamp default now(),
  updated_at timestamp default now(),
  published boolean default false
);