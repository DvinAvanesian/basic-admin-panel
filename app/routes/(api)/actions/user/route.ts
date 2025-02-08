import { connectDB } from '~/lib/mongoose'
import { User } from '~/models'
import fieldsValid from '~/lib/util/fieldsValid'
import { SessionManager, Logger } from '~/modules'
import { NextRequest } from 'next/server'

export const POST = async (request: NextRequest) => {
  const session = new SessionManager()
  const auth = await session.getAuthStatus()
  const XFW = request.headers.get('X-Forwarded-For')
  const logger = new Logger({ client: XFW, url: '/actions/user', method: 'POST' })

  if (!auth) {
    logger.info({ message: 'Not logged in' })
    return new Response(null, { status: 404 })
  }

  logger.update({
    client: XFW,
    url: '/actions/sa/client',
    method: 'POST',
    user: await session.getProp<string>('user.username')
  })

  // not authenticated if no privilege token
  if (auth.level !== 'priv') {
    logger.info({ message: `Authentication required` })
    return new Response(null, { status: 401 })
  }

  const perms = await session.getProp<string[]>('user.permissions')

  // return 403 Forbidden if user does not have permission for requested action
  if (!perms.includes('usersWrite') && !perms.includes('any')) {
    logger.info({ message: `Forbidden` })
    return new Response(null, { status: 403 })
  }

  await connectDB()

  const data = await request.formData()

  // return 422 Unprocessable Content if formData parse failed
  if (!request.formData || !data) {
    logger.info({ message: `Failed parsing FormData` })
    return new Response(null, { status: 422 })
  }

  const obj = Object.fromEntries(data)

  const isValid = fieldsValid(obj, ['username', 'password', 'enName', 'enSurname', 'faName', 'faSurname', 'phoneCode', 'phoneNumber', 'email'])

  // return 400 Request Body Malformed if body does not have required fields
  if (!isValid) {
    {
      logger.info({ message: 'Request body malformed' })
      return new Response(null, { status: 400, statusText: 'Request Body Malformed' })
    }
  }

  const currentClient = await session.getProp<string>('user.parent._id')
  const currentClientID = await session.getProp<string>('user.parent.clientID')

  const adminID = Bun.env.ADMIN_ID || 'admin'

  const user = new User({
    username: obj.username,
    password: obj.password,
    userInfo: {
      name: {
        'en-US': obj.enName,
        fa: obj.faName
      },
      surname: {
        'en-US': obj.enSurname,
        fa: obj.faSurname
      },
      contactPhone: {
        countryCode: obj.phoneCode,
        number: obj.phoneNumber
      },
      email: obj.email
    },
    permissions: [],
    isSysAdmin: currentClientID === adminID,
    parent: currentClient,
    userPrefs: {
      lang: Bun.env.DEFAULT_LANGUAGE || 'en-US',
      theme: 'system'
    }
  })

  try {
    const group = crypto.randomUUID()
    await user.save()
    await logger.action({
      message: 'Created user successfully',
      action: 'createUser',
      group,
      user: await session.getProp<string>('user._id'),
      newValues: []
    })
    return Response.json({ userID: user.userID }, { status: 201 })
  } catch (e: any) {
    // return 409 Conflict if provided username already exists
    if (e.code === 11000) {
      logger.info({ message: `User "${obj.username}" exists` })
      return new Response(null, { status: 409, statusText: 'User Exists' })
    }

    // return 500 Internal Server Error in case of unhandled error
    logger.error({ message: e.message })
    return new Response(null, { status: 500 })
  }
}
