import path from 'path'
import { getDb } from '../database/mongodb'
import LocalSettingsStorage from '../data/LocalSettingsStorage'
import { ObjectId } from 'mongodb'
import DbCollections from '../constants/Collections'
const xlsx = require('xlsx')
const fs = require('fs')

const filePath = path.resolve(__dirname, '../data/questions/Data.xlsx')
const questionsFile = xlsx.readFile(filePath)
const questionsInEnglish = questionsFile.Sheets['Questions']
const data = xlsx.utils.sheet_to_json(questionsInEnglish)

const timeStamp: () => number = () => {
  // const oneHour = 60 * 60 * 1000
  const fiveMinutes = 5 * 60 * 1000
  const newStamp = new Date().getTime() - fiveMinutes
  return newStamp
}

const dbQuestionUpdate = async () => {
  const db = getDb()
  const settingsCollectionId = new ObjectId(
    LocalSettingsStorage.databaseSettingsCollectionId
  )

  try {
    await db.collection(DbCollections.QUESTIONS).drop()

    await data.forEach((el: {}) => {
      db.collection(DbCollections.QUESTIONS).insertOne(el)
    })

    await db
      .collection(DbCollections.SETTINGS)
      .updateOne(
        { _id: settingsCollectionId },
        { $set: { lastQuestionUpdate: new Date() } }
      )
    console.log('Questions were updated!')
  } catch (e) {
    console.log(e)
  }
}

const updateQuestionHandler = () => {
  fs.stat(filePath, (err: any, stats: any) => {
    if (err) {
      throw err
    } else if (stats.mtime > timeStamp()) {
      console.log('I should update questions collection...')
      dbQuestionUpdate()
    } else {
      console.log('Question collection is up to date...')
    }
  })
}

export default updateQuestionHandler
