import pg from 'pg'
import './dotenv.js'

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: 'postgres',
    ssl: {
        rejectUnauthorized: false
    }
};

const dbName = process.env.PGDATABASE;

const createDb = async () => {
    const pool = new pg.Pool(config);
    const client = await pool.connect();

    try {
        await client.query(`CREATE DATABASE "${dbName}"`);
        console.log(`✅ Database "${dbName}" created successfully!`);
    } catch (err) {
        if (err.code === '1') { 
            console.log(`✅ Database "${dbName}" already exists.`);
        } else {
            console.error(`Error creating database "${dbName}":`, err);
        }
    } finally {
        client.release();
        pool.end();
    }
};

createDb();
