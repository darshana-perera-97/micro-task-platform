const bcrypt = require('bcrypt');

async function generateHashes() {
  const passwords = {
    admin: 'admin123',
    qa: 'qa123',
    user: 'user123'
  };

  console.log('Generating password hashes...\n');
  
  for (const [role, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`${role}: ${hash}`);
  }
}

generateHashes().catch(console.error);

