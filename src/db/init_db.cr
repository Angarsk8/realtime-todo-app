require "pg"

DB_NAME = "notes_db"
PG_PATH = "postgres://postgres:postgres@db:5432"

# Creates connection with the default postgres db
conn = PG.connect("#{PG_PATH}/postgres")

database_exists? = conn.exec(%{
  SELECT CAST(1 AS integer)
  FROM pg_database
  WHERE datname=$1
}, [DB_NAME]).to_hash.empty? ? false : true

if !database_exists?
  # Creates the notes_db database with UTF8 encoding and close the connection
  puts "Creating database: #{DB_NAME}..."
  conn.exec("CREATE DATABASE #{DB_NAME} ENCODING 'UTF8';")
  conn.close

  # Creates connection with the newly created db
  puts "Connecting database: #{DB_NAME}..."
  conn = PG.connect("#{PG_PATH}/#{DB_NAME}")

  # Creates the notes table in the newly created database
  puts "Creating notes table in #{DB_NAME}..."
  conn.exec(%{
    CREATE TABLE notes (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      content     TEXT NOT NULL,
      created_at  TIMESTAMP WITH TIME ZONE NOT NULL,
      updated_at  TIMESTAMP WITH TIME ZONE NOT NULL
    );
  })
  puts "Process finished succesfully"
else
  puts "The database #{DB_NAME} already exists!!"
end

puts "Closing connection..."
conn.close
