# Todo Basic App (Crystal - Kemal - WebSockets - React - PostgreSQL - Docker)

## Requirements
* Crystal 0.18.7
* PostgreSQL (v9.5.2)
* Node (v5.11.1)
* NPM (v3.8.6)
* Docker (v1.12.1) && Docker-Compose (v1.8.0)

<sup>**Node and NPM are both optional if you are just going to run the app, but necessary for development since they are needed to run webpack*<sup>

## Manual Installation
Before you can run this program you have to install the packages that it uses. You do that with `$ shards install `.
You also need to configure the path to the PostgreSQL database in the files `src/db/init_db.cr` and `src/app.cr`

```crystal
# src/db/init_db.cr
require "pg"

# Configure these two variables
DB_NAME = "db_name"
PG_PATH = "postgres://user:password@localhost:5432"

...
```

```crystal
# src/app.cr
require "kemal"
require "pg"

require "./app/models/*"

public_folder "src/public"

# Configure the path of the database based on what you did in the src/db/init_db.cr file
DB_PATH = "postgres://user:password@localhost:5432"
...
```

Once you have installed the dependencies and configured the database path, you need to create the actual database and table for the application. You do that by running  `$ crystal src/db/init_db.cr`.

### Run Project
You can run this program in two ways:

1. Compile/build the project using the command line with `$ crystal build src/notes.cr --release` and run the executable `$ ./notes`
2. Run the program with `$ crystal src/notes.cr` (no compilation required)

Once you have run the program, you can open a browser window at [localthost:3000](http://localhost:3000) and see the actual app. You can open the app in several browser windows and see how they change in real time via websockets. In the first option you can also pass the port number as an argument to the program, like this `./notes --port <port-number>` and the program will show at `http://<server-ip-number>:<port-number>`.

## Installation With Docker

You nee to run one single command: `docker-compose up` or `docker-compose up -d`.

## Live Demo

You can see and use a live demo of the app here: [kemal-ws-react-pg-todo.herokuapp.com](https://kemal-ws-react-pg-todo.herokuapp.com/).

<sup>**Take in mind that this is just a dummy app written in few hours as a proof of concept*<sup>.

## Development

* `$ npm install`
* `$ npm run dev && crystal src/notes.cr`
