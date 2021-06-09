import express, { NextFunction } from 'express'
import { json } from 'body-parser'
import { mongoConnect } from './database/mongodb'
import { Server } from 'socket.io'

import updateQuestionHandler from './function/updateQuestionsHandler'
import LocalSettingsStorage from './data/LocalSettingsStorage'
// import LocalDataStorage from './data/LocalDataStorage'

import settingsRoutes from './routes/SettingsRoutes'
import gameRoutes from './routes/GameRoutes'
import singlePlayerRoutes from './routes/SinglePlayerRoutes'
import resutlsRoutes from './routes/ResultsRoutes'

import multiplayerGameHandler from './game-multiplayer/connection/multiplayerGameHandler'

const app = express()
const http = require('http').createServer(app)
export const io = new Server(http, { cors: { origin: '*' } })

const onConnection = (socket: any) => {
  multiplayerGameHandler(socket)
}

io.on('connection', onConnection)

app.use(json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use('/settings', settingsRoutes)
app.use('/game', gameRoutes)
app.use('/singleplayer', singlePlayerRoutes)
app.use('/results', resutlsRoutes)

app.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    console.log(error)
    const name = error.name
    const message = error.message
    const data = error.stack
    res.status(500).json({ name: name, message: message, data: data })
  }
)

mongoConnect(() => {
  LocalSettingsStorage.setUpSettingsCollection()
    .then(() => {
      updateQuestionHandler()
    })
    .then(() => {
      http.listen(8080, () => {
        console.log('Server is running at PORT 8080!')
      })
    })
    .catch((err) => console.log(err))
})
