import { customAlphabet } from 'nanoid'

const genID = (count: number = 16) => customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', count)()

export default genID
