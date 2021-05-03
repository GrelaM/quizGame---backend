import path from 'path'
import { getDb } from '../database/mongodb'
import LocalSettingsStorage from '../data/LocalSettingsStorage'
import { ObjectId } from 'mongodb'
const xlsx = require('xlsx')
const fs = require('fs')

const filePath = path.resolve(__dirname, '../data/questions/Data.xlsx')
const questionsFile = xlsx.readFile(filePath)
const questionsInEnglish = questionsFile.Sheets['Questions']
const data = xlsx.utils.sheet_to_json(questionsInEnglish)

const updateQuestionHandler = () => {

  const timeStamp: () => number = () => {
    // const oneHour = 60 * 60 * 1000
    const fiveMinutes = 1 * 60 * 1000
    const newStamp = new Date().getTime() - fiveMinutes
    return newStamp
  }

  fs.stat(filePath, (err: any, stats: any) => {
    if (err) {
      throw err
    } else if (stats.mtime > timeStamp()) {
      console.log('I should update questions collection...')
      const db = getDb()
      return db
        .collection('questions')
        .drop()
        .then(() => {
          data.forEach((el: {}) => {
            return db
              .collection('questions')
              .insertOne(el)
              .catch((err) => console.log(err))
          })
        })
        .then(() => {
          const settingsCollectionId = new ObjectId(LocalSettingsStorage.databaseSettingsCollectionId)
          db.collection('settings')
            .updateOne(
              { _id: settingsCollectionId },
              { $set: {"lastQuestionUpdate": new Date()}}
            )
            .catch(err => console.log(err))
        })
        .then(() => console.log('Questions were updated!'))
        .catch((err) => console.log(err))
    } else {
      console.log('Question collection is up to date...')
    }
  })
}

export default updateQuestionHandler
