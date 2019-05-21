# Crypto Wallet Frontend

The repository contains the client side React code + A rendering server (express)

# The rendering server

The rendering server which is part of the frontend layer has two functions:
- Blocks access to code for disconnected users
- Acts as proxy for api calls, preventing direct access to the api server

# Development

* To run the frontend with the rendering server:

run npm build
npm run server

## To run a local development client with webpack hot-reloading (recommended for development):

1. Set the environment variable REACT_APP_HOST and set it to point to your local webpack server.
For example:
export REACT_APP_HOST=http://localhost:3000

2. cd client && npm start

## To connect to a local API server, add the environment variable API_HOST.

For example, create a .env file with this line:
export API_HOST=http://localhost:1337



