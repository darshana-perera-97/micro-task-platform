const bcrypt = require('bcrypt');
const { readJSON, writeJSON } = require('../utils/fileHandler');

/**
 * Seed script to create default users with properly hashed passwords
 * Run: node scripts/seedUsers.js
 */
async function seedUsers() {
  try {
    console.log('🌱 Seeding users...');

    // Get admin credentials from .env or use defaults
    require('dotenv').config();
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '123456';
    const defaultPassword = 'password'; // Default password for other test users

    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const users = [
      {
        id: 'admin-1',
        name: 'Admin User',
        email: adminEmail,
        password: adminHashedPassword,
        role: 'admin',
        points: 0,
        totalEarned: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'qa-1',
        name: 'Sarah Johnson',
        email: 'qa@platform.com',
        password: hashedPassword,
        role: 'qa',
        points: 0,
        totalEarned: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        points: 75,
        totalEarned: 275,
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-2',
        name: 'Emily Smith',
        email: 'emily@example.com',
        password: hashedPassword,
        role: 'user',
        points: 120,
        totalEarned: 320,
        status: 'active',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-3',
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: hashedPassword,
        role: 'user',
        points: 45,
        totalEarned: 145,
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    ];

    writeJSON('users', users);
    console.log('✅ Users seeded successfully!');
    console.log(`\n📋 Admin login credentials:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n📋 Other test users (password: "password"):');
    console.log('   QA:    qa@platform.com');
    console.log('   User:  john@example.com');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;

