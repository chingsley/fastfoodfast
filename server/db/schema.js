const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('connected to the db...');
});

/**
 * Create users table
 */
const createUsersTable = () => {
    const queryText = `CREATE TABLE IF NOT EXISTS
        users(
            id serial PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(128) UNIQUE NOT NULL,
            password VARCHAR(128) NOT NULL,
            is_admin BOOLEAN NOT NULL,
            created_date TIMESTAMP,
            modified_date TIMESTAMP

        )`;
        
        pool.query(queryText)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Create orders Table
 */
const createOrdersTable = () => {
    const queryText = `CREATE TABLE IF NOT EXISTS
        orders(
            id serial PRIMARY KEY,
            items TEXT NOT NULL,
            price REAL NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'new',
            owner_id serial NOT NULL,
            created_date TIMESTAMP,
            modified_date TIMESTAMP,
            FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
        )`;

        pool.query(queryText)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
                pool.end();
            });
};

/**
 * Create menu Table
 */
const createMenuTable = () => {
    const queryText = `CREATE TABLE IF NOT EXISTS
        menu(
            id serial PRIMARY KEY,
            food_name VARCHAR(255) NOT NULL,
            food_image VARCHAR(255) NOT NULL DEFAULT 'https://images.pexels.com/photos/750073/pexels-photo-750073.jpeg?auto=compress&cs=tinysrgb&h=350',
            price REAL NOT NULL
        )`;

        pool.query(queryText)
            .then((res) => {
                console.log(res);
                pool.end();
            })
            .catch((err) => {
                console.log(err);
                pool.end();
            });
};

/**
 * Drop users Table
 */
const dropUsersTable = () => {
    const queryText = 'DROP TABLE IF EXISTS users';
    pool.query(queryText)
    .then((res) => {
        console.log(res);
        pool.end();
    })
    .catch((err) => {
        console.log(err);
        pool.end();
    });
};

/**
 * Drop orders Table
 */
const dropOrdersTable = () => {
    const queryText = 'DROP TABLE IF EXISTS orders';
    pool.query(queryText)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Drop menu Table
 */
const dropMenuTable = () => {
    const queryText = 'DROP TABLE IF EXISTS menu';
    pool.query(queryText)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

/**
 * Create All Tables
 */
const createAllTables = () => {
    createUsersTable();
    createMenuTable();
    createOrdersTable();
};

/**
 * Drop All Tables
 */
const dropAllTables = () => {
    dropUsersTable();
    dropMenuTable();
    dropOrdersTable();
};

pool.on('remove', () => {
    console.log('table removed');
    process.exit(0);
});

module.exports = {
    createUsersTable,
    createMenuTable,
    createOrdersTable,
    createAllTables,
    dropUsersTable,
    dropMenuTable,
    dropOrdersTable,
    dropAllTables

};

require('make-runnable');