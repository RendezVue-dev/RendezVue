import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import EventsRouter from './routes/events.js'
import GroupsRouter from './routes/groups.js'
import HobbiesRouter from './routes/hobbies.js'
import UserHobbyRouter from './routes/userHobby.js'
import UsersRouter from './routes/users.js'
import InsightsRouter from './routes/insights.js'
import MatchesRouter from './routes/matches.js'
import EventParticipationRouter from './routes/eventParticipation.js'
import GroupMemberRouter from './routes/groupMembers.js'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json());        // parse JSON bodies
app.use(cors());                // enable CORS for all routes

// specify the api path for the server to use
app.get("/", (req, res) =>{
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">RendezVue API</h1>');
});


if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    )
}

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})

app.use('/events', EventsRouter);

app.use('/groups', GroupsRouter);

app.use('/users', UsersRouter);

app.use('/hobbies', HobbiesRouter);

app.use('/userHobby', UserHobbyRouter);

app.use('/insights', InsightsRouter);

app.use('/matches', MatchesRouter);

app.use('/eventParticipation', EventParticipationRouter);

app.use('/groupMembers', GroupMemberRouter);