# RendezVue

CodePath WEB103 Final Project

Designed and developed by: Dylan Dang, Fay Nguyen

🔗 Link to deployed app: [RendezVue](https://rendezvue-client.onrender.com/)

## About

### Description and Purpose

This application is designed to connect people who share the same hobbies and live nearby to foster meaningful friendships and community connections. The app functions similarly to a dating platform but focuses on hobby-based matching. Users can create profiles highlighting their interests, such as dancing, hiking, painting, or gaming, and the app will match them with others in close proximity who enjoy the same activities. The goal is to encourage people to meet, share experiences, and spend quality time doing what they love—turning neighborhoods into vibrant networks of shared passion

### Inspiration

This application is inspired by Dylan's hobby of ballroom dancing. He always wants to look for a non-romantic partner who lives nearby and shares the same hobby so they can spend the time together experiencing the hobby. Therefore, this app is what he has been looking for over a long time.

## Tech Stack

Frontend: React.js, HTML, CSS, TailwindCSS

Backend: Express.js, PostgreSQL

## Features

✅ : completed feature

### ✅ Hobby-Based and location-based Matching

Connect people nearby who share the same favorite hobbies, from ballroom dancing, cooking, hiking to raving, by selecting interests in the user's profile. The app uses location data to suggest people within a chosen distance radius, so you can easily meet up locally.

![Matches](Match.gif)

### ✅ Event Discovery

Create or join hobby-related events in the nearby area, whether it’s a weekend dance class, art jam, cooking class, or running group. If you create an event

![Events](Events.gif)

### ✅ Authentication

Users need to create an account or log in to access the app’s features. They can sign up using their email, phone number, or third-party accounts (such as Google or Facebook). Authentication ensures user privacy and security while allowing the app to personalize hobby matches and save preferences. Once logged in, users can manage their profiles, update interests, and start connecting with nearby hobby partners.(gif goes here)

![Authentication](Authentication.gif)

### ✅  Hobby Explore Page

Discover trending hobbies and create hobbies for ourselves.

![Hobby Explore](HobbyExplore.gif)

### ✅ Group Matching

Not just one-on-one — join small groups of people who share your hobby for more social and inclusive meetups.

![Group Matching](Groups.gif)

### ✅ Personalized Profiles

Show off the user's hobbies and information their personalized profile. They can also upload photos or achievements related to their interests. (further development)

![Profile](Profile.gif)

### ✅ User Insights 

Get data-driven insights into how well the user match with others based on shared interests, frequency of interaction, and proximity.

![Insights](Insights.gif)

### ✅ Database Implementation

Database and server side implemented completely

<img src="Database.gif" />

### Further development

## Installation Instructions

Installation & Setup
### **Backend Setup**
1. Clone the repository:
   ```sh
   git clone https://github.com/RendezVue-dev/RendezVue.git
   cd RendezVue
   ```
2. Install dependencies:
   ```sh
   cd server
   npm install
   ```
3. Create `.env` file:
   ```sh
    PGDATABASE=
    PGHOST=
    PGPASSWORD=
    PGPORT=
    PGUSER="rendezvue_user"
   ```
4. Set up the database:
   ```sh
    npm run reset
   ```
5. Start the backend server:
   ```sh
    npm run start
   ```

### **Frontend Setup**
1. Navigate to the frontend directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm run dev
   ```
