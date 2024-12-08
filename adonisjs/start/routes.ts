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
import User from '#models/user'
import Channel from '#models/channel'
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
        user.visibility_status = 'online'

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
      response.status(200).send({ username: user.username, password: user.password })
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

router.patch('/logout', async({ request, response }) => {
  const credentials = request.only(['username'])
  const user = await User.findBy('username', credentials.username)
  user.visibility_status = 'offline'
  response.status(200).send({ message: 'Offline' })
})

router.get('/users', async ({ request, response }) => {
  const body = request.only(['channel'])

})

router.post('/join', async ({request, response }) => {
  const body = request.only(['channelName', 'userName', ])
})

router.get('/channel', async ({ request, response }) => {})

