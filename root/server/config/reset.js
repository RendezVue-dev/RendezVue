import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'
import parser from 'csv-parser'

const currentPath = fileURLToPath(import.meta.url);

/*

const usersData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/users.json')));

const eventsData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/events.json')));

const groupsData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/groups.json')));

const hobbiesData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/hobbies.json')));

const insightsData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/insights.json')));

const matchesData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/matches.json')));

const users_hobbiesData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/users_hobbies.json')));

*/

const zipcodeData = JSON.parse(fs.readFileSync(path.join(dirname(currentPath), '/data/zipcodes.json')));

const createUsersTable = async () => {
    const createUsersTableQuery = `
        DROP TABLE IF EXISTS users CASCADE;

        CREATE TABLE IF NOT EXISTS users (
            id serial PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            username VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            age INTEGER NOT NULL,
            city VARCHAR(50) NOT NULL,
            state VARCHAR(10) NOT NULL,
            zipcode INTEGER NOT NULL,
            FOREIGN KEY (zipcode) REFERENCES zipcodes(zipcode),
            bio VARCHAR,
            created_at TIMESTAMP NOT NULL,
            modified_at TIMESTAMP NOT NULL
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

/*
const seedUsersTable = async () => {    
    await createUsersTable();
    usersData.forEach( async (user) => {
        const insertQuery = {
            text: 'INSERT INTO users (first_name, last_name, username, age, city, state, zipcode, bio, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        };
        const values = [
            user.first_name,
            user.last_name,
            user.username,
            user.age,
            user.city,
            user.state,
            user.zipcode,
            user.bio || null,     
            user.created_at,           
            user.modified_at           
        ];
        try {
            await pool.query(insertQuery, values);
            console.log(`✅ ${user.username} added successfully`);
        } catch (err) {
            console.error('⚠️ error inserting user', err);
        };
    });
};
*/

const createHobbiesTable = async () =>{
    const createHobbiesTableQuery = `
        DROP TABLE IF EXISTS hobbies CASCADE;

        CREATE TABLE IF NOT EXISTS hobbies (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description VARCHAR(200),
            population INTEGER NOT NULL,
            created_at TIMESTAMP NOT NULL
      );`;
    try {
        const res = await pool.query(createHobbiesTableQuery)
        console.log('🎉 hobbies table created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating hobbies table', err)
    }
};

/*
const seedHobbiesTable = async () => {    
    await createHobbiesTable();
    hobbiesData.forEach( async (hobby) => {
        const insertQuery = {
            text: 'INSERT INTO hobbies (name, description, population, created_at) VALUES ($1, $2, $3, $4)',
        };
        const values = [
            hobby.name,
            hobby.description,
            hobby.population,
            hobby.created_at   
        ];
        try {
            await pool.query(insertQuery, values);
            console.log(`✅ ${hobby.name} added successfully`);
        } catch (err) {
            console.error('⚠️ error inserting hobby', err);
        };
    });
};
*/

const createUserHobbyTable = async () => {
    const createUserHobbyTableQuery = `
        DROP TABLE IF EXISTS user_hobby CASCADE;

        CREATE TABLE IF NOT EXISTS user_hobby (
            user_id INTEGER NOT NULL,
            hobby_id INTEGER NOT NULL,
            PRIMARY KEY (user_id, hobby_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
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

/*
const seedUserHobbyTable = async () => {    
    await createUserHobbyTable();
    users_hobbiesData.forEach( async (user_hobby) => {
        const insertQuery = {
            text: 'INSERT INTO user_hobby (user_id, hobby_id) VALUES ($1, $2);',
        };
        const values = [
            user_hobby.user_id, 
            user_hobby.hobby_id
        ];
        try {
            await pool.query(insertQuery, values);
            console.log(`✅ hobby-user added successfully`);
        } catch (err) {
            console.error('⚠️ error inserting hobby-user', err);
        };
    });
};
 */

const createEventsTable = async () => {
    const createEventsTableQuery = `
        DROP TABLE IF EXISTS events CASCADE;

        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            creator_id INTEGER NOT NULL ,
            FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            hobby_id INTEGER NOT NULL,
            FOREIGN KEY (hobby_id) REFERENCES hobbies(id),
            title VARCHAR(200) NOT NULL,
            description VARCHAR(500),
            venue_name VARCHAR(200) NOT NULL,
            venue_street_address VARCHAR(200) NOT NULL,
            venue_city VARCHAR(50) NOT NULL,
            venue_state VARCHAR(20) NOT NULL,
            venue_zipcode INTEGER NOT NULL,
            FOREIGN KEY (venue_zipcode) REFERENCES zipcodes(zipcode),
            start_time TIMESTAMP NOT NULL,
            capacity INTEGER,
            created_at TIMESTAMP NOT NULL,
            modified_at TIMESTAMP NOT NULL
        )
    `;
    try {
        const res = await pool.query(createEventsTableQuery)
        console.log('🎉 events table created successfully')
    }
        catch (err) {
        console.error('⚠️ error creating events table', err)
    };

};

/*
const seedEventsTable = async () => {    
    await createEventsTable();
    eventsData.forEach( async (event) => {
        const insertQuery = {
            text: 'INSERT INTO events (creator_id, hobby_id, title, description, venue_name, venue_street_address, venue_city, venue_state, venue_zip_code, start_time, capacity, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);',
        };
        const values = [
            event.creator_id, 
            event.hobby_id, 
            event.title, 
            event.description || null, 
            event.venue_name, 
            event.venue_street_address, 
            event.venue_city, 
            event.venue_state, 
            event.venue_zip_code, 
            event.start_time, 
            event.capacity || null, 
            event.created_at, 
            event.modified_at   
        ];
        try {
            await pool.query(insertQuery, values);
            console.log(`✅ ${event.title} added successfully`);
        } catch (err) {
            console.error('⚠️ error inserting event', err);
        };
    });
};
*/

const createEventParticipationTable = async () => {
    const createEventParticipationTableQuery = `
        DROP TABLE IF EXISTS event_participation;

        CREATE TABLE IF NOT EXISTS event_participation (
            event_id INTEGER NOT NULL REFERENCES events(id),
            user_id INTEGER NOT NULL REFERENCES users(id),
            host BOOL NOT NULL,
            registered_at TIMESTAMP NOT NULL
        );
    `;

    try {
        const res = await pool.query(createEventParticipationTableQuery)
        console.log('🎉 event_participation table created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating event_participation table', err)
    }
};

const createGroupsTable = async () => {
    const createGroupsTableQuery = `
        DROP TABLE IF EXISTS groups CASCADE;

        CREATE TABLE IF NOT EXISTS groups(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description VARCHAR(200), 
            hobby_id INTEGER NOT NULL,
            num_members INTEGER NOT NULL,
            FOREIGN KEY (hobby_id) REFERENCES hobbies(id),
            created_by INTEGER NOT NULL ,
            FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            created_at TIMESTAMP NOT NULL,
            modified_at TIMESTAMP NOT NULL
        );
    `;

    try {
        const res = await pool.query(createGroupsTableQuery)
        console.log('🎉 groups table created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating groups table', err)
    }
};

/*
const seedGroupsTable = async () => {    
    await createGroupsTable();
    groupsData.forEach( async (group) => {
        const insertQuery = {
            text: 'INSERT INTO groups (name, description, hobby_id, created_by, num_members, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        };
        const values = [
            group.name,
            group.description || null,
            group.hobby_id,
            group.created_by,
            group.num_members,
            group.created_at,
            group.modified_at  
        ];
        try {
            await pool.query(insertQuery, values);
            console.log(`✅ ${group.name} added successfully`);
        } catch (err) {
            console.error('⚠️ error inserting group', err);
        };
  
        });
};
*/

const createGroupMemberTable = async () => {
    const createGroupMemberTableQuery = `
        DROP TABLE IF EXISTS group_member CASCADE;

        CREATE TABLE IF NOT EXISTS group_member(
            group_id INTEGER NOT NULL REFERENCES groups(id),
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            admin BOOL NOT NULL,
            joined_at TIMESTAMP NOT NULL
        );
    `;

    try {
        const res = await pool.query(createGroupMemberTableQuery)
        console.log('🎉 group_member table created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating group_member table', err)
    }
};

const createMatchesTable = async () => {
    const createMatchesTableQuery = `
        DROP TABLE IF EXISTS matches CASCADE;

        CREATE TABLE IF NOT EXISTS matches(
            user1_id INTEGER NOT NULL,
            FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            user2_id INTEGER NOT NULL,
            FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            hScore FLOAT NOT NULL,
            proximity_miles FLOAT NOT NULL,
            compatibility_score FLOAT NOT NULL,
            suggested BOOL NOT NULL,
            match BOOL NOT NULL,
            matched_at TIMESTAMP,
            last_updated TIMESTAMP NOT NULL
        );

        CREATE UNIQUE INDEX unique_user_pair ON matches (
            LEAST(user1_id, user2_id),
            GREATEST(user1_id, user2_id)
        );
    `;

    try {
        const res = await pool.query(createMatchesTableQuery)
        console.log('🎉 matches table created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating matches table', err)
    }
};

/*
const seedMatchesTable = async () => {    
    await createMatchesTable();
    matchesData.forEach( async (match) => {
        const insertQuery = {
            text: 'INSERT INTO matches (user1_id, user2_id, shared_hobbies_count, proximity_km , interaction_count, compatibility_score, suggested, match, matched_at,last_updated) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);',
        };
        const values = [
            match.user1_id, 
            match.user2_id,
            match.shared_hobbies_count,
            match.proximity_km,
            match.interaction_count,
            match.compatibility_score,
            match.suggested,
            match.match,
            match.matched_at || null,
            match.last_updated
        ];
        try {
            await pool.query(insertQuery, values);
            console.log(`✅ match added successfully`);
        } catch (err) {
            console.error('⚠️ error inserting match', err);
        };
    });
};
*/

const createInsightsTable = async () => {
    const createInsightsTableQuery = `
        DROP TABLE IF EXISTS insights CASCADE;

        CREATE TABLE IF NOT EXISTS insights(
            user_id INTEGER PRIMARY KEY,
            total_matches INTEGER NOT NULL,
            active_hobbies INTEGER NOT NULL,
            events_joined INTEGER NOT NULL,
            events_hosted INTEGER NOT NULL,
            groups_joined INTEGER NOT NULL,
            avg_compatibility_score FLOAT NOT NULL,
            updated_at TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
        );
    `;

    try {
        const res = await pool.query(createInsightsTableQuery)
        console.log('🎉 insights table created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating insights table', err)
    }
};

/*
const seedInsightsTable = async () => {    
    await createInsightsTable();
    insightsData.forEach( async (insight) => {
        const insertQuery = {
            text: 'INSERT INTO insights (user_id, total_matches, active_hobbies, events_joined, events_hosted, groups_joined, avg_match_score, total_interactions, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        };
        const values = [
            insight.user_id,
            insight.total_matches || null,
            insight.active_hobbies,
            insight.events_joined,
            insight.events_hosted,
            insight.groups_joined,
            insight.avg_match_score,
            insight.updated_at
        ];
        try {
            await pool.query(insertQuery, values);
            console.log(`✅ insight of ${insight.user_id} added successfully`);
        } catch (err) {
            console.error('⚠️ error inserting insight', err);
        };
    });
};
*/

const createZipcodesTable = async () => {
    const createZipcodesTableQuery = `
        DROP TABLE IF EXISTS zipcodes CASCADE;

        CREATE TABLE IF NOT EXISTS zipcodes (
            zipcode INTEGER PRIMARY KEY,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL
        );
    `;

    try {
        const res = await pool.query(createZipcodesTableQuery)
        console.log('🎉 zipcodes table created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating zipcodes table', err)
    };

};

const seedZipcodesTable = async () => {    
    await createZipcodesTable();
    
    console.log(`📦 Inserting ${zipcodeData.length} zipcodes in batches...`);
    const batchSize = 1000;
    
    for (let i = 0; i < zipcodeData.length; i += batchSize) {
        const batch = zipcodeData.slice(i, i + batchSize);
        const values = [];
        const placeholders = [];
        
        batch.forEach((zipcode, index) => {
            const offset = index * 3;
            placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
            values.push(zipcode.zipcode, zipcode.lat, zipcode.long);
        });
        
        const insertQuery = `
            INSERT INTO zipcodes (zipcode, latitude, longitude) 
            VALUES ${placeholders.join(', ')}
            ON CONFLICT (zipcode) DO NOTHING;
        `;
        
        try {
            await pool.query(insertQuery, values);
            console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(zipcodeData.length / batchSize)}`);
        } catch (err) {
            console.error('⚠️ error inserting zipcode batch', err);
        }
    }
    
    console.log(`✅ All ${zipcodeData.length} zipcodes inserted successfully!`);
};

const main = async () => {
    console.log("🚀 Starting table creation & seeding...");
    await seedZipcodesTable();
    await createUsersTable();
    await createHobbiesTable();
    await createUserHobbyTable();
    await createEventsTable();
    await createEventParticipationTable();
    await createGroupsTable();
    await createGroupMemberTable();
    await createMatchesTable();
    await createInsightsTable();

    console.log("✅ All tables created successfully!");
};

main();