import express, { NextFunction } from 'express'
import { json } from 'body-parser'
import { mongoConnect } from './database/mongodb'
import updateQuestionHandler from './function/updateQuestionsHandler'
import LocalSettingsStorage from './data/LocalSettingsStorage'

import settingsRoutes from './routes/SettingsRoutes'
import gameRoutes from './routes/GameRoutes'
import singlePlayerRoutes from './routes/SinglePlayerRoutes'
import resutlsRoutes from './routes/ResultsRoutes'

const app = express()

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
      app.listen(8080, () => {
        console.log('Server is running at PORT 8080!')
      })
    })
    .catch((err) => console.log(err))  
})
