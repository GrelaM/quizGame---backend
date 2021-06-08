import { RequestHandler } from 'express'
import { getDb } from '../../database/mongodb'
import { ObjectId } from 'mongodb'
import DbCollections from '../../constants/Collections'
import updateQuestionsHandler from '../../function/updateQuestionsHandler'
import LocalSettingsStorage from '../../data/LocalSettingsStorage'

export const questionUpdateHandler: RequestHandler = async (req, res, next) => {
  try {
    await updateQuestionsHandler()

    res.status(200).json({
      message: 'Question collection has been updated successfully!'
    })
  } catch (e) {
    res.status(500).json({
      message: 'Server faced some issues. Please try again later...'
    })
  }
}

export const infoHandler: RequestHandler = async (req, res, next) => {
  const db = getDb()
  const settingsCollectionId = LocalSettingsStorage.databaseSettingsCollectionId
  const infoId = new ObjectId(settingsCollectionId)

  try {
    const fetchedInfo = await db.collection(DbCollections.SETTINGS).findOne({ _id: infoId })

    res.status(200).json({
      message: 'Game data have been fetched seccussfully!',
      data: fetchedInfo
    })
  } catch (e) {
    res.status(500).json({
      message: 'Server faced some issues. Please try again later...'
    })
  }
}
