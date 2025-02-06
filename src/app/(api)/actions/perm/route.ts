import { connectDB } from '@/lib/mongoose'
import { User } from '@/models'
import fieldsValid from '@/lib/util/fieldsValid'
import { SessionManager, Logger } from '@/modules'
import { NextRequest } from 'next/server'

export const POST = async (request: NextRequest) => {
  const session = new SessionManager()
  const auth = await session.getAuthStatus()
  const XFW = request.headers.get('X-Forwarded-For')
  const logger = new Logger({ client: XFW, url: '/actions/perm', method: 'POST' })

  if (!auth) {
    logger.info({ message: 'Not logged in' })
    return new Response(null, { status: 404 })
  }

  logger.update({
    client: XFW,
    url: '/actions/perm',
    method: 'POST',
    user: await session.getProp<string>('user.username')
  })

  // not authenticated if no privilege token
  if (auth.level !== 'priv') {
    logger.info({ message: `Authentication required` })
    return new Response(null, { status: 401 })
  }

  const perms = await session.getProp<string>('user.permissions')

  // return 403 Forbidden if user does not have permission for requested action
  if (!perms.includes('usersWrite') && !perms.includes('any')) {
    logger.info({ message: `Forbidden` })
    return new Response(null, { status: 403 })
  }

  await connectDB()

  const data = await request.json()

  // return 422 Unprocessable Content if formData parse failed
  if (!request.json || !data) {
    logger.info({ message: `Failed parsing JSON` })
    return new Response(null, { status: 422 })
  }

  const isValid = fieldsValid(data, ['userID', 'permissions'])

  // return 400 Request Body Malformed if body does not have required fields
  if (!isValid) {
    {
      logger.info({ message: 'Request body malformed' })
      return new Response(null, { status: 400, statusText: 'Request Body Malformed' })
    }
  }

  const { userID, permissions } = data

  const user = await User.findOne({ userID })
  const currentClient = await session.getProp<string>('user.parent._id')

  if (!user || !user.parent.equals(currentClient)) {
    {
      logger.info({ message: 'Invalid user requested' })
      return new Response(null, { status: 400, statusText: 'Invalid User' })
    }
  }

  try {
    const oldValues = user.permissions
    await user.updateOne({ permissions })
    await user.save()
    const group = crypto.randomUUID()
    await logger.action({
      message: 'Updated user permissions successfully',
      action: 'permUpdate',
      group,
      user: await session.getProp<string>('user._id'),
      oldValues,
      newValues: permissions,
      affected: {
        user: [user._id as string]
      }
    })
    return new Response(null, { status: 200 })
  } catch (e: any) {
    // return 500 Internal Server Error in case of unhandled error
    logger.error({ message: `Unhandled error occurred: ${e.message}` })
    return new Response(null, { status: 500 })
  }
}
