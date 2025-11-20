# RendezVue

CodePath WEB103 Final Project

Designed and developed by: Dylan Dang, Fay Nguyen

🔗 Link to deployed app: [RendezVue](https://rendezvue-itds.onrender.com)

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

## Goals

### Baseline Features (MUST complete ALL)

- [X] The web app includes an Express backend app and a React frontend app.
- [X] The web app includes dynamic routes for both frontend and backend apps.
- [X] The web app is deployed on Render with all pages and features working.

#### Backend Features

- [X] The web app implements at least one of each of the following database relationship in Postgres:
    * [X] one-to-many
    * [X] many-to-many with a join table
- [X] The web app implements a well-designed RESTful API that:
    * [X] supports all four main request types for a single entity (ex. tasks in a to-do list app): GET, POST,PATCH, and DELETE
    * [X] the user can view items, such as tasks
    * [X] the user can create a new item, such as a task
    * [X] the user can update an existing item by changing some or all of its values, such as changing the title of task
    * [X] the user can delete an existing item, such as a task
- [X] Implements proper naming conventions for routes.
- [X] The web app includes the ability to reset the database to its default state.

#### Frontend Features

- [X] The web app implements at least one redirection, where users are able to navigate to a new page with a new URL within the app (Register -> Log In)
- [X] The web app implements at least one interaction that the user can initiate and complete on the same page without navigating to a new page (create new hobby)
- [X] The web app uses dynamic frontend routes created with React Router.
- [X] The web app uses hierarchically designed React components:
    * [X] Components are broken down into categories, including page and component types.
    * [X] Corresponding container components and presenter components as appropriate.
- [X] The project is deployed on Render with all pages and features that are visible to the user are working as intended

### Custom Features (MUST complete TWO)

- [X] The web app gracefully handles errors.
- [X] The user can filter or sort items based on particular criteria as appropriate for your use case.
- [X] Data is automatically generated in response to a certain event or user action. Examples include generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account.(match and insight entry created when a new user register)
- [X] Data submitted via a POST or PATCH request is validated before the database is updated (e.g. validating that an event is in the future before allowing a new event to be created)

### Stretch Features

- [X] A subset of pages require the user to log in before accessing the content.
- [X] Restrict available user options dynamically, such as restricting available purchases based on a user's currency. (admin can kick or add other user admin)

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
