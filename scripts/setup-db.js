const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  try {
    // Create connection without database selected
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'user',
      password: 'password'
    });

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS poetry_network');
    console.log('Database created successfully');

    // Close the connection
    await connection.end();
    console.log('Database setup completed');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 