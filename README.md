# Todo Basic App (Crystal - Kemal - WebSockets - React - PostgreSQL)

## Requirements
* Crystal 0.18.7
* PostgreSQL (I have the v9.5.2)
* Node (I have the v5.11.1)
* NPM (I have the v3.8.6)

<sup>**Node and NPM are both optional if you are just going to run the app, but necessary for development since they are needed to run webpack*<sup>

## Installation
Before you can run this program you have to install the packages that it uses. You do that with `$ shards install `.
You also need to change the path to the PostgreSQL database in `src/db/init_db.cr` and `src/notes.cr`

```crystal
# src/db/init_db.cr
require "pg"

# Configure these two variables
DB_NAME = "db_name"
PG_PATH = "postgres://user:password@localhost:5432"

...
```

```crystal
# src/notes.cr
require "kemal"
require "json"
require "pg"
require "./app/lib/note"

public_folder "src/public"

COMPOSE = ".compose_psql_db_path"

# Configure the path of the database based on what you did in the src/db/init_db.cr file
DB_PATH = File.file?(COMPOSE) ? File.read(COMPOSE) : "postgres://user:password@localhost:5432/db_name"

...
```

Once you have installed the dependencies and configured the database path, you need to create the actual database and table for the application. You do that by running  `$ crystal src/db/init_db.cr`.

## Run Project
You can run this program in two ways:

1. Compile/build the project using the command line with `$ crystal build src/notes.cr --release` and run the executable `$ ./notes`
2. Run the program with `$ crystal src/notes.cr` (no compilation required)

Once you have run the program, you can open a browser window at [localthost:3000](http://localhost:3000) and see the actual app. You can open the app in several browser windows and see how they change in real time via websockets.

## Live Demo

You can see and use a live demo of the app here: [kemalwspgtodo.herokuapp.com](https://kemalwspgtodo.herokuapp.com).

<sup>**Take in mind that this is just a dummy app written in few hours as a proof of concept*<sup>.

## Development

`$ npm run dev && crystal src/notes.cr`
