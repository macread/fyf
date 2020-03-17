This project is in response to Fix Your Funnel code challenge. Two requirements are still to be completed:

1. The thumbnails and large picture will not load. It has to do with pulling the image data from the Postgres database.
2. The user comments are not implemented.

The stack is React (16.13.0), Node.js (v12.11.1) and the current version of Postgres running on Huroku.

The seed files in the src/server/db folder contain queries for building the Postgres tables.

Your .env file should have the following items:

SERVER_PORT=3005
SESSION_SECRET=thisisverysecretdontyouthink
CONNECTION_STRING=

The connection string is supplied by Huroku.

