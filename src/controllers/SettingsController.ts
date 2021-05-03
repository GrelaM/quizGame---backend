import { RequestHandler } from 'express'
import { getDb } from '../database/mongodb'
import { ObjectId } from 'mongodb'
import updateQuestionsHandler from '../function/updateQuestionsHandler'
import LocalSettingsStorage from '../data/LocalSettingsStorage'

export const questionUpdateHandler: RequestHandler = (req, res, next) => {
  const update = async () => {
    await updateQuestionsHandler()
  }
  update()
    .then(() => {
      res.status(200).json({
        message: 'This is your info'
      })
    })
    .catch((err) => console.log(err))
}

export const infoHandler: RequestHandler = (req, res, next) => {
  const db = getDb()
  const settingsCollectionId = LocalSettingsStorage.databaseSettingsCollectionId
  const infoId = new ObjectId(settingsCollectionId)

  db.collection('settings')
    .findOne({ _id: infoId })
    .then((info) => {
      res.status(200).json({
        message: 'This is your info',
        data: info
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: 'Something went wrong...'
      })
    })
}
