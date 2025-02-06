/* eslint-disable no-undef */
import mongoose from 'mongoose'
import UserSchema from '../src/models/user/schemas/user'
import ClientSchema from '../src/models/client/schemas/client'

const uri = Bun.env.MONGO_URI

if (!uri) {
  console.error('MONGO_URI is not defined in .env file')
  process.exit(1)
}

const User = mongoose.model('User', UserSchema)
const Client = mongoose.model('Client', ClientSchema)

async function createInitialData() {
  try {
    await mongoose.connect(uri)

    await User.deleteMany({})
    await Client.deleteMany({})

    const client = new Client({
      clientInfo: {
        name: {
          full: { 'en-US': 'John Doe Enterprises', fa: 'شرکت جان دو' },
          short: { 'en-US': 'JDE', fa: 'جان دو' }
        },
        contactInfo: {
          phoneNumbers: [{ title: { 'en-US': 'Primary', fa: 'اصلی' }, countryCode: '1', number: '5551234567' }],
          emails: [{ address: 'contact@johndoe.com' }],
          addresses: [{ title: { 'en-US': 'Headquarters', fa: 'دفتر اصلی' }, address: { fa: 'خیابان اصلی، تهران', 'en-US': 'Main Street, Tehran' } }]
        }
      },
      clientID: Bun.env.ADMIN_ID,
      brandColor: '#FF5733'
    })

    await client.save()

    const user = new User({
      username: 'johndoe',
      parent: client._id,
      password: 'securepassword123',
      userInfo: {
        name: { 'en-US': 'John', fa: 'جان' },
        surname: { 'en-US': 'Doe', fa: 'دو' },
        contactPhone: { countryCode: '1', number: '5557654321' },
        email: 'john.doe@example.com'
      },
      userPrefs: {
        theme: 'light',
        lang: 'en-US'
      },
      permissions: ['any'],
      isSysAdmin: true
    })

    await user.save()

    console.log('Initial data created successfully')
    mongoose.disconnect()
  } catch (error) {
    console.error('Error creating initial data:', error)
    mongoose.disconnect()
  }
}

createInitialData()
