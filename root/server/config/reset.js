import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url);

const usersData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/users.json')));

const eventsData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/events.json')));

const groupsData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/groups.json')));

const hobbiesData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/hobbies.json')));

const insightsData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/insights.json')));

const matchesData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/matches.json')));

const users_hobbiesData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/users_hobbies.json')));

const createUsersTable = async () => {
    const createUsersTableQuery = `
        DROP TABLE IF EXISTS users;

        CREATE TABLE IF NOT EXISTS users (
            id serial PRIMARY KEY
            first_name VARCHAR(100) NOT NULL
            last_name VARCHAR(100) NOT NULL
            username VARCHAR(100) NOT NULL
            age INTEGER NOT NULL
            city VARCHAR(50) NOT NULL
            state VARCHAR(10) NOT NULL
            zipcode INTEGER NOTNULL
            bio VARCHAR
            created_at DATETIME NOT NULL
            modified_at DATETIME NOT NULL
        );
    `;

    try {
        const res = await pool.query(createUsersTableQuery)
        console.log('🎉 users table created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating users table', err)
    };

};

const seedTripsTable = async () => {    
    await createTripsTable();
    tripsData.forEach((trip) => {
        const insertQuery = {
            text: 'INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        };
        const values = [
            trip.title,
            trip.description,
            trip.img_url,
            trip.num_days,
            trip.start_date,
            trip.end_date,
            trip.total_cost
        ];
        pool.query(insertQuery, values, (err, res) => {
            if (err) {
                console.error('⚠️ error inserting trip', err)
                return
            }

            console.log(`✅ ${trip.title} added successfully`)
        });
    
    })
};

const createHobbiesTable = async () =>{
    const createHobbiesTableQuery = `
        DROP TABLE IF EXISTS hobbies;

        CREATE TABLE IF NOT EXISTS hobbies (
            id SERIAL PRIMARY KEY
            name VARCHAR(100) NOT NULL
            description VARCHAR(200)
            population INTEGER NOT NULL
            created_at DATETIME NOT NULL
      );`;
    try {
        const res = await pool.query(createHobbiesTableQuery)
        console.log('🎉 hobbies table created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating hobbies table', err)
    }
};

const createUserHobbyTable = async () => {
    const createUserHobbyTableQuery = `
        DROP TABLE IF EXISTS user_hobby ;

        CREATE TABLE IF NOT EXISTS user_hobby (
            user_id INTEGER NOT NULL,
            hobby_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, hobby_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE,
            FOREIGN KEY (hobby_id) REFERENCES hobbies(id) ON UPDATE CASCADE
        );
    `;

    try {
        const res = await pool.query(createUserHobbyTableQuery)
        console.log('🎉 user_hobby table created successfully')
        }
    catch (err) {
        console.error('⚠️ error creating user_hobby table', err)
    }
};

const createEventsTable = async () => {
    const createEventsTableQuery = `
        DROP TABLE IF EXISTS events;

        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY
            creator_id INTEGER NOT NULL REFERENCES users(id)
            hobby_id INTEGER NOT NULL REFERENCES hobbies(id)
            title VARCHAR(200) NOT NULL
            description VARCHAR(500)
            venue_name VARCHAR(200) NOT NULL
            venue_street_address VARCHAR(200) NOT NULL
            venue_city VARCHAR(50) NOT NULL
            venue_state VARCHAR(20) NOT NULL
            venue_zip_code INTEGERR NOT NULL
            start_time DATETIME NOT NULL
            end_time DATETIME
            capacity INTEGERR 
            created_at DATETIME NOT NULL
            modified_at DATETIME NOT NULL
        )
    `;
    try {
    const res = await pool.query(createEventsTableQuery)
    console.log('🎉 events table created successfully')
    }
    catch (error) {
    console.error('⚠️ error creating events table', err)
    };

};

const createEventParticipationTable = async () => {
    const createEventParticipationTableQuery = `
        DROP TABLE IF EXISTS event_participation;

        CREATE TABLE IF NOT EXISTS event_participation (
            event_id INTEGER NOT NULL REFERENCES events(id)
            user_id INTEGER NOT NULL REFERENCES users(id)
            host BOOL NOT NULL
            reistered_at DATETIME NOT NULL
        );
    `;

    try {
        const res = await pool.query(createEventParticipationTableQuery)
        console.log('🎉 event_participation table created successfully')
    }
    catch (error) {
        console.error('⚠️ error creating event_participation table', err)
    }
};

const createGroupsTable = async () => {
    const createGroupsTableQuery = `
        DROP TABLE IF EXISTS groups;

        CREATE TABLE IF NOT EXISTS groups(
            id SERIAL PRIMARY KEY
            name VARCHAR(100) NOT NULL
            description VARCHAR(200) 
            hobby_id int NOT NULL REFERENCE hobbies(id)
            created_by int NOT NULL REFERENCE users(id)
            created_at DATETIME NOT NULL
            modified_at DATETIME NOT NULL
        );
    `;

    try {
        const res = await pool.query(createGroupsTableQuery)
        console.log('🎉 groups table created successfully')
    }
    catch (error) {
        console.error('⚠️ error creating groups table', err)
    }
};

const createGroupMemberTable = async () => {
    const createGroupMemberTableQuery = `
        DROP TABLE IF EXISTS group_member;

        CREATE TABLE IF NOT EXISTS group_member(
            group_id INTEGER NOT NULL REFERENCES groups(id)
            user_id INTEGER NOT NULL REFERENCES users(id)
            admin BOOL NOT NULL
            joined_at DATETIME NOT NULL
        );
    `;

    try {
        const res = await pool.query(createGroupsTableQuery)
        console.log('🎉 group_member table created successfully')
    }
    catch (error) {
        console.error('⚠️ error creating group_member table', err)
    }
};

const createMatchesTable = async () => {
    const createMatchesTableQuery = `
        DROP TABLE IF EXISTS matches;

        CREATE TABLE IF NOT EXISTS matches(
            id  SERIAL PRIMARY KEY
            user1_id INTEGER NOT NULL
            user2_id INTEGER NOT NULL
            shared_hobbies_count INTEGER NOT NULL
            proximity_km  FLOAT NOT NULL
            interaction_count INTEGER NOT NULL
            compatibility_score FLOAT NOT NULL
            suggested BOOL NOT NULL
            match BOOL NOT NULL
            matched_at DATETIME
            last_updated DATETIME NOT NULL
        );
    `;

    try {
        const res = await pool.query(createMatchesTableQuery)
        console.log('🎉 matches table created successfully')
    }
    catch (error) {
        console.error('⚠️ error creating matches table', err)
    }
};

const createInsightsTable = async () => {
    const createInsightsTableQuery = `
        DROP TABLE IF EXISTS insights;

        CREATE TABLE IF NOT EXISTS insights(
            id SERIAL PRIMARY KEY
            user_id INTEGER NOT NULL
            total_matches INTEGER NOT NULL
            active_hobbies INTEGER NOT NULL
            events_joined INTEGER NOT NULL
            events_hosted INTEGER NOT NULL
            groups_joined INTEGER NOT NULL
            messages_sent INTEGER NOT NULL
            avg_match_score FLOAT NOT NULL
            avg_response_time FLOAT NOT NULL
            total_interactions INTEGER NOT NULL
            updated_at DATETIME NOT NULL
        );
    `;

    try {
        const res = await pool.query(createInsightsTableQuery)
        console.log('🎉 insights table created successfully')
    }
    catch (error) {
        console.error('⚠️ error creating insights table', err)
    }
};