import postgres from 'postgres';
import bcrypt from 'bcrypt';
import 'dotenv/config';


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Roles to seed
const roles = ['superadmin', 'admin', 'user'];

// Seed single superadmin user
const superadminUser = {
  id: '410544b2-4001-4271-9855-fec4b6a6442b', // fixed UUID for predictability
  name: 'Super Admin',
  email: 'superadmin@example.com',
  password: '123456', // will be hashed
};

async function seedRoles() {
  await sql`
    CREATE TABLE IF NOT EXISTS roles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );
  `;

  for (const role of roles) {
    await sql`
      INSERT INTO roles (name)
      VALUES (${role})
      ON CONFLICT (name) DO NOTHING;
    `;
  }
  console.log('Roles seeded');
}

async function seedUsers() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  const hashedPassword = await bcrypt.hash(superadminUser.password, 10);
  await sql`
    INSERT INTO users (id, name, email, password)
    VALUES (${superadminUser.id}, ${superadminUser.name}, ${superadminUser.email}, ${hashedPassword})
    ON CONFLICT (email) DO NOTHING;
  `;

  console.log('Superadmin user seeded');
}

async function seedUserRoles() {
  await sql`
    CREATE TABLE IF NOT EXISTS user_roles (
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, role_id)
    );
  `;

  const superadminRole = await sql`
    SELECT id FROM roles WHERE name='superadmin' LIMIT 1
  `;

  await sql`
    INSERT INTO user_roles (user_id, role_id)
    VALUES (${superadminUser.id}, ${superadminRole[0].id})
    ON CONFLICT DO NOTHING;
  `;

  console.log('Superadmin assigned role');
}

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

  console.log('Customers, invoices, revenue tables created');
}

async function main() {
  try {
    console.log('Seeding database...');
    await seedRoles();
    await seedUsers();
    await seedUserRoles();
    await seedCustomersInvoicesRevenue();
    console.log('Database seeding complete ✅');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

main();
