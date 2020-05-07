require('dotenv').config()

const express = require('express');
const server = require('./server');

const port = process.env.PORT;

server.listen(5000, () => {
    console.log(`Server listening on http://localhost:${port}`)
  })