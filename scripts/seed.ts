import postgres from 'postgres';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Roles to seed
const roles = ['admin', 'manager', 'editor', 'viewer'];

// Seed single superadmin user
const superadminUser = {
  id: '410544b2-4001-4271-9855-fec4b6a6442b', // fixed UUID for predictability
  name: 'Super Admin',
  email: 'superadmin@example.com',
  password: '123456', // will be hashed
};

// ============================================
// 1. SEED ROLES TABLE
// ============================================
async function seedRoles() {
  await sql`
    CREATE TABLE IF NOT EXISTS roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(50) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const roleDescriptions: Record<string, string> = {
    admin: 'Full system access',
    manager: 'Can manage users and content',
    editor: 'Can edit content',
    viewer: 'Read-only access',
  };

  for (const role of roles) {
    await sql`
      INSERT INTO roles (name, description)
      VALUES (${role}, ${roleDescriptions[role]})
      ON CONFLICT (name) DO NOTHING;
    `;
  }
  console.log('✅ Roles seeded');
}

// ============================================
// 2. SEED PERMISSIONS TABLE
// ============================================
async function seedPermissions() {
  await sql`
    CREATE TABLE IF NOT EXISTS permissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) UNIQUE NOT NULL,
      resource VARCHAR(50) NOT NULL,
      action VARCHAR(50) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const permissions = [
    // Invoices
    { name: 'invoices.create', resource: 'invoices', action: 'create', description: 'Create new invoices' },
    { name: 'invoices.read', resource: 'invoices', action: 'read', description: 'View invoices' },
    { name: 'invoices.update', resource: 'invoices', action: 'update', description: 'Edit invoices' },
    { name: 'invoices.delete', resource: 'invoices', action: 'delete', description: 'Delete invoices' },
    
    // Customers
    { name: 'customers.create', resource: 'customers', action: 'create', description: 'Create new customers' },
    { name: 'customers.read', resource: 'customers', action: 'read', description: 'View customers' },
    { name: 'customers.update', resource: 'customers', action: 'update', description: 'Edit customers' },
    { name: 'customers.delete', resource: 'customers', action: 'delete', description: 'Delete customers' },
    
    // Users
    { name: 'users.create', resource: 'users', action: 'create', description: 'Create new users' },
    { name: 'users.read', resource: 'users', action: 'read', description: 'View users' },
    { name: 'users.update', resource: 'users', action: 'update', description: 'Edit users' },
    { name: 'users.delete', resource: 'users', action: 'delete', description: 'Delete users' },
    
    // Posts/Blogs
    { name: 'posts.create', resource: 'posts', action: 'create', description: 'Create new posts' },
    { name: 'posts.read', resource: 'posts', action: 'read', description: 'View posts' },
    { name: 'posts.update', resource: 'posts', action: 'update', description: 'Edit posts' },
    { name: 'posts.delete', resource: 'posts', action: 'delete', description: 'Delete posts' },
    
    // Dashboard
    { name: 'dashboard.view', resource: 'dashboard', action: 'read', description: 'View dashboard' },
  ];

  for (const perm of permissions) {
    await sql`
      INSERT INTO permissions (name, resource, action, description)
      VALUES (${perm.name}, ${perm.resource}, ${perm.action}, ${perm.description})
      ON CONFLICT (name) DO NOTHING;
    `;
  }
  console.log('✅ Permissions seeded');
}

// ============================================
// 3. SEED ROLE_PERMISSIONS (Many-to-Many)
// ============================================
async function seedRolePermissions() {
  await sql`
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (role_id, permission_id)
    );
  `;

  // Admin: All permissions
  await sql`
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT r.id, p.id
    FROM roles r, permissions p
    WHERE r.name = 'admin'
    ON CONFLICT DO NOTHING;
  `;

  // Manager: All except user management
  await sql`
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT r.id, p.id
    FROM roles r, permissions p
    WHERE r.name = 'manager'
      AND p.name NOT LIKE 'users.%'
    ON CONFLICT DO NOTHING;
  `;

  // Editor: Read all, edit invoices/customers/posts
  await sql`
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT r.id, p.id
    FROM roles r, permissions p
    WHERE r.name = 'editor'
      AND (
        p.action = 'read' 
        OR p.name IN ('invoices.update', 'customers.update', 'posts.update')
      )
    ON CONFLICT DO NOTHING;
  `;

  // Viewer: Read only
  await sql`
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT r.id, p.id
    FROM roles r, permissions p
    WHERE r.name = 'viewer'
      AND p.action = 'read'
    ON CONFLICT DO NOTHING;
  `;

  console.log('✅ Role permissions assigned');
}

// ============================================
// 4. SEED USERS TABLE (with role_id)
// ============================================
async function seedUsers() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role_id UUID REFERENCES roles(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const hashedPassword = await bcrypt.hash(superadminUser.password, 10);
  
  // Get admin role ID
  const adminRole = await sql`
    SELECT id FROM roles WHERE name = 'admin' LIMIT 1
  `;

  await sql`
    INSERT INTO users (id, name, email, password, role_id)
    VALUES (${superadminUser.id}, ${superadminUser.name}, ${superadminUser.email}, ${hashedPassword}, ${adminRole[0].id})
    ON CONFLICT (email) DO NOTHING;
  `;

  console.log('✅ Users seeded (admin user created)');
}

// ============================================
// 5. SEED CUSTOMERS, INVOICES, REVENUE
// ============================================
async function seedCustomersInvoicesRevenue() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL REFERENCES customers(id),
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

  console.log('✅ Customers, invoices, and revenue tables created');
}

// ============================================
// 6. SEED POSTS TABLE (for blogs)
// ============================================
async function seedPostsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      author TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      published BOOLEAN DEFAULT FALSE
    );
  `;

  // Seed sample posts
  const samplePosts = [
    {
      title: 'Getting Started with Next.js',
      content: 'Next.js is a React framework for production. This guide will help you get started...',
      excerpt: 'Learn the basics of Next.js and start building amazing web applications.',
      author: 'Super Admin',
      published: true,
    },
    {
      title: 'Docker for Local Development',
      content: 'Docker ensures all developers have identical environments. Learn how to use Docker...',
      excerpt: 'Master Docker and eliminate environment inconsistencies across your team.',
      author: 'Super Admin',
      published: true,
    },
    {
      title: 'Role-Based Access Control',
      content: 'RBAC is a powerful way to manage permissions in your application...',
      excerpt: 'Implement secure permission management with RBAC patterns.',
      author: 'Super Admin',
      published: false,
    },
  ];

  for (const post of samplePosts) {
    await sql`
      INSERT INTO posts (title, content, excerpt, author, published)
      VALUES (${post.title}, ${post.content}, ${post.excerpt}, ${post.author}, ${post.published})
      ON CONFLICT DO NOTHING;
    `;
  }

  console.log('✅ Posts table created with sample data');
}

// ============================================
// 7. CREATE USEFUL VIEWS
// ============================================
async function seedViews() {
  // View: All role permissions
  await sql`
    DROP VIEW IF EXISTS role_permissions_view CASCADE;
    CREATE VIEW role_permissions_view AS
    SELECT 
      r.name as role_name,
      p.name as permission_name,
      p.resource,
      p.action,
      p.description
    FROM roles r
    JOIN role_permissions rp ON r.id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    ORDER BY r.name, p.resource, p.action;
  `;

  // View: User permissions
  await sql`
    DROP VIEW IF EXISTS user_permissions_view CASCADE;
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
  `;

  console.log('✅ Views created');
}

// ============================================
// 8. CREATE HELPER FUNCTIONS
// ============================================
async function seedFunctions() {
  // Function: Check if user has permission
  await sql`
    DROP FUNCTION IF EXISTS user_has_permission(TEXT, TEXT);
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
  `;

  // Function: Get all user permissions
  await sql`
    DROP FUNCTION IF EXISTS get_user_permissions(TEXT);
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
  `;

  console.log('✅ Helper functions created');
}

// ============================================
// 9. CREATE INDEXES FOR PERFORMANCE
// ============================================
async function seedIndexes() {
  await sql`
    CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
    CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
    CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
    CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource);
    CREATE INDEX IF NOT EXISTS idx_permissions_action ON permissions(action);
    CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
    CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
  `;

  console.log('✅ Indexes created');
}

// ============================================
// 10. ENABLE ROW LEVEL SECURITY (Optional)
// ============================================
async function seedRLS() {
  await sql`
    ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Allow read access to roles" ON roles;
    CREATE POLICY "Allow read access to roles" ON roles
      FOR SELECT TO authenticated USING (true);

    DROP POLICY IF EXISTS "Allow read access to permissions" ON permissions;
    CREATE POLICY "Allow read access to permissions" ON permissions
      FOR SELECT TO authenticated USING (true);

    DROP POLICY IF EXISTS "Allow read access to role_permissions" ON role_permissions;
    CREATE POLICY "Allow read access to role_permissions" ON role_permissions
      FOR SELECT TO authenticated USING (true);
  `;

  console.log('✅ Row Level Security enabled');
}

// ============================================
// 11. MAIN SEED FUNCTION
// ============================================
async function main() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Seed in correct order (dependencies first)
    await seedRoles();
    await seedPermissions();
    await seedRolePermissions();
    await seedUsers();
    await seedCustomersInvoicesRevenue();
    await seedPostsTable();
    await seedViews();
    await seedFunctions();
    await seedIndexes();
    await seedRLS();

    console.log('\n✅ Database seeding complete!');
    console.log('\n📝 Login credentials:');
    console.log(`   Email: ${superadminUser.email}`);
    console.log(`   Password: ${superadminUser.password}`);
    console.log('\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

main();