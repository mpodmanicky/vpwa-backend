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

  const checkUsername = await User.find('username', credentials.username)
  if (checkUsername === null) {
    const checkEmail = await User.find('email', credentials.email)
    if (checkEmail === null) {
      if (credentials.password === credentials.repassword) {
        user.name = credentials.name
        user.username = credentials.username
        user.email = credentials.email
        user.password = credentials.password

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

  console.log(request.body())
  response.status(200).send({ email: credentials.email, password: credentials.password })
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
  console.log(request.body())
  response.status(200).send({ email: credentials.email, password: credentials.password })
})
