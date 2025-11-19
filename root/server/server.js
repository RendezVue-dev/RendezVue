import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import EventsRouter from './routes/events.js'
import GroupsRouter from './routes/groups.js'
import HobbiesRouter from './routes/hobbies.js'
import UserHobbyRouter from './routes/userHobby.js'
import UsersRouter from './routes/users.js'
import AuthRouter from './routes/auth.js'
import InsightsRouter from './routes/insights.js'
import MatchesRouter from './routes/matches.js'
import EventParticipationRouter from './routes/eventParticipation.js'
import GroupMemberRouter from './routes/groupMembers.js'

process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';


const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json());        // parse JSON bodies
app.use(cors());                // enable CORS for all routes
app.use(cookieParser());        // parse cookies

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

app.use('/api/events', EventsRouter);

app.use('/api/groups', GroupsRouter);

app.use('/api/users', UsersRouter);

app.use('/api/auth', AuthRouter);

app.use('/api/hobbies', HobbiesRouter);

app.use('/api/userHobby', UserHobbyRouter);

app.use('/api/insights', InsightsRouter);

app.use('/api/matches', MatchesRouter);

app.use('/api/eventParticipation', EventParticipationRouter);

app.use('/api/groupMembers', GroupMemberRouter);