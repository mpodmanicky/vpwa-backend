# vpwa-backend
AdonisJS SPA for Development of Progressive Web Applications. FIIT 2024

### Installation
`npm i adonisjs@latest ./directory`<br>

After this installation I chose the slim kit. AdonisJS offers Web and API options aswell.
Although I chose to install Slim Kit to better understand all possible configurations AdonisJS offers.
### Further configuration

To create the database we have the option to decide between AdonisJS Lucid and Redis.
We decided to go with the AdonisJS Lucid, to install:

`cd to adonis directory`
`npm i @adonisjs/lucid`
`node ace add @adonisjs/lucid`

After the npm command you will be promted with the database client. For our purpose we chose **PostgreSQL**. After this, to save time creating models, migrations, seeders we use following commands

`node ace make:model User`

If we want a migration to be created simultaniously, following up the statement with:
` -m`

So in short, making a model and migration is as easy as:
`node ace make:model User -m`
