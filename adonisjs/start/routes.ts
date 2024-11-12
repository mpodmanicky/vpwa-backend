/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => 'It works!')

router.post('/registerUser', async ({ request, response }) => {
  const credentials = request.only(['name', 'username', 'email', 'password', 'repassword'])

  console.log(request.body())
  response.status(200).send({ email: credentials.email, password: credentials.password })
})

router.post('/loginUser', async ({ request, response }) => {
  const credentials = request.only(['email', 'password'])

  console.log(request.body())
  response.status(200).send({ email: credentials.email, password: credentials.password })
})
