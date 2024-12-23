/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import db from '@adonisjs/lucid/services/db'
import User, { VisibilityStatus } from '#models/user'
import Channel from '#models/channel'
import Ws from '#services/Ws'
router.get('/', async () => 'It works!')

/*
 * response message: (password, email, username)
 * - to handle on the client each message type and display errors correctly
 * - after successfull registration email and password are sent
 * - request.body awaits textfield values
 * - using User model from app/models/user
 * */
router.post('/registerUser', async ({ request, response }) => {
  const user = new User()
  const credentials = request.only(['name', 'username', 'email', 'password', 'repassword'])
  const checkUsername = await User.findBy('username', credentials.username)
  if (checkUsername === null) {
    const checkEmail = await User.findBy('email', credentials.email)
    if (checkEmail === null) {
      if (credentials.password === credentials.repassword) {
        user.name = credentials.name
        user.username = credentials.username
        user.email = credentials.email
        user.password = credentials.password
        user.visibility_status = VisibilityStatus.Online

        await user.save()

        if (user.$isPersisted) {
          response
            .status(200)
            .send({ username: credentials.username, password: credentials.password })
        }
      } else {
        response.status(400).send({ message: 'Password' })
      }
    } else {
      response.status(400).send({ message: 'Email' })
    }
  } else {
    response.status(400).send({ message: 'Username' })
  }

  //console.log(request.body())
  //response.status(200).send({ email: credentials.email, password: credentials.password })
})
/*
 * response message: (password, email)
 * - to handle errors on the client side
 * - finds user by email, checks passwords
 * - correct login returns all channels with user_id + username
 *   */
router.post('/loginUser', async ({ request, response }) => {
  const credentials = request.only(['email', 'password'])

  const user = await User.findBy('email', credentials.email)
  if (user) {
    if (user.password === credentials.password) {
      response
        .status(200)
        .send({ username: user.username, password: user.password, status: user.visibility_status })
    } else {
      response.status(400).send({ message: 'Password' })
    }
  } else {
    response.status(400).send({ message: 'Email' })
  }
})

router.post('/createChannel', async ({ request, response }) => {
  const credentials = request.only(['username', 'name', 'visibility'])

  const channel = await Channel.findBy('name', credentials.name)
  if (!channel) {
    const user = await User.findBy('username', credentials.username)
    const newChannel = new Channel()
    newChannel.name = credentials.name
    // user cannot be null while creating channel, it can only be done whilst logged in
    newChannel.owner_id = user.id

    await newChannel.save()

    await newChannel.related('users').attach([user.id])

    if (newChannel.$isPersisted) {
      response.status(200).send({ channel: newChannel.name })
    } else {
      response.status(400).send({ message: 'Error' })
    }
  } else {
    response.status(400).send({ message: 'Exist' })
  }
})

router.post('/deleteChannel', async ({ request, response }) => {
  const credentials = request.only(['username', 'name'])
  const channel = await Channel.findBy('name', credentials.name)
  await channel.delete()

  response.status(200).send({ message: 'Deleted' })
})

router.post('/channel', async ({ request, response }) => {
  console.log('loading channels...')
  const credentials = request.only(['username'])
  const user = await User.findBy('username', credentials.username)
  const channels = await user.related('channels').query()
  if (channels) {
    response.status(200).send({ channels: channels })
  } else {
    response.status(400).send({ message: 'Empty' })
  }
})

router.patch('/logout', async ({ request, response }) => {
  const credentials = request.only(['username'])
  const user = await User.findBy('username', credentials.username)
  if (user) {
    user.visibility_status = VisibilityStatus.Offline
    response.status(200).send({ message: 'Offline' })
  } else {
    response.status(404).send({ message: 'NOT FOUND' })
  }
})

router.get('/users', async ({ request, response }) => {
  const body = request.only(['channel'])
})

router.patch('/user', async ({ request, response }) => {
  const body = request.only(['username', 'status'])

  const user = await User.findBy('username', body.username)
  if (user) {
    switch (body.status) {
      case 'online':
        user.visibility_status = VisibilityStatus.Online
        response.status(200).send({ data: VisibilityStatus.Online })
        break
      case 'offline':
        user.visibility_status = VisibilityStatus.Offline
        response.status(200).send({ data: VisibilityStatus.Offline })
        break
      case 'do not disturb':
        user.visibility_status = VisibilityStatus.Away
        response.status(200).send({ data: VisibilityStatus.Away })
        break
      default:
        console.log('unknown')
    }
  } else {
    response.status(404).send({ data: 'USER NOT FOUND' })
  }
})
router.post('/joinChannel', async ({ request, response }) => {
  const body = request.only(['channel', 'username'])
  const channel = await Channel.findBy('name', body.channel)
  const user = await User.findBy('username', body.username)
  if (channel) {
    if (channel.visibility === 'private') {
      return response.status(403).send({ data: 'Channel is private' })
    } else {
      // join channel with user
      await channel.related('users').attach([user.id])
      await channel.save()
      return response.status(200).send({ data: channel.name })
    }
  } else {
    // create the channel
    const newChannel = new Channel()
    newChannel.name = body.channel
    newChannel.owner_id = user.id

    await newChannel.save()

    await newChannel.related('users').attach([user.id])
    if (newChannel.$isPersisted) {
      return response.status(200).send({ channel: newChannel.name })
    } else {
      return response.status(400).send({ message: 'Error' })
    }
  }
})

router.post('/list', async ({ request, response }) => {
  const body = request.only(['channel'])
  const channel = await Channel.findBy('name', body.channel)
  if (channel) {
    await channel.load('users')
    const users = channel.users
    return response.status(200).send({ users })
  } else {
    return response.status(404).send({ message: 'channel does not exist' })
  }
})

router.post('/messages', async ({ request, response }) => {
  const body = request.only(['channel'])
  const channel = await Channel.findBy('name', body.channel)
  if (channel) {
    const messages = await channel.related('messages').query().preload('user')
    return response
      .status(200)
      .send({ messages })
  } else {
    return response.status(400).send({ message: 'messages are empty' })
  }
})
