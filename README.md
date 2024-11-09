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

```
node ace make:model User
node ace make:migration User
node ace make:seeder User
```

If we want a migration to be created simultaniously, following up the statement with:
` -m`

So in short, making a model and migration is as easy as:
`node ace make:model User -m`

The database configuration is saved in **config/database.ts**
Then the newly created folder **database** contains migrations and seeders
**Models** are stored in **app/models**.

After this your folder structure should be
```
project/
    |_app/
        -exceptions/
        -middleware/
        -models/
            -your_models.ts
    |_bin/
    |_config/
        -...
        -(new)database.ts
    |_database/
        -migrations/
            -your_migrations.ts
        -seeders/
            -your_seeders.ts
    |_start/
    |_tests/
    ...
        
```
### One file setup
Now after our DB is setup we can start moving our frontend to the project.
Our frontend code is supposed to be within **project/resources**. So in order to do this, we update the project.
In terminal: 
```
cd project
mkdir resources
cd resources
mkdir views js css fonts images
```
### Two file setup
Now that DB and backend is setup, we keep frontend and backend in separate repositories.
Dockerizing the backend with *docker-compose.yml* and running the frontend connection to the backend.

#### Setting up docker-compose
To setup docker-compose for our adonisjs project we have to create Dockerfile and docker-compose.yml
So, in our backend repository.
Terminal:
```
cd project
touch Dockerfile
touch docker-compose.yml
```
This creates Dockerfile and docker-compose.yml in our repository.

#### Docker file example
```
```
#### docker-compose example
```
```
