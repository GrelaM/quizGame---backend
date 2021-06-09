import LocalSettingsStorage from '../data/LocalSettingsStorage'

const gameIdGeneretor = (digits: number) => {
  const idsArray = LocalSettingsStorage.artificialGameIds
  
  const singleId = () => {
    const elNum: number = digits
    let key: string = '#'
    for (let i = 0; i < elNum; i++) {
      let x = Math.floor(Math.random() * 10)
      key += x
    }
    return key
  }

  let generetedId: string = singleId();

  while (idsArray.includes(generetedId)) {
    singleId()
  }

  LocalSettingsStorage.saveArtificialGameIds(generetedId)
  return generetedId
}

export default gameIdGeneretor
