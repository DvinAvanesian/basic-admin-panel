import { every } from 'lodash'

const fieldsValid = (obj: { [key: string]: string | FormDataEntryValue }, p: string[]) =>
  every(p.map((item) => item in obj && obj[item] !== ''))

export default fieldsValid
