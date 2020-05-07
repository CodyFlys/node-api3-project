const express = require('express');
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');
const server = express();

server.use(express.json());


server.get('/', (req, res) => {
  res.status(200).json({messageoftheday: process.env.MOTD});
});

//custom middleware
server.use(logger)

function logger(req, res, next) {}
function validateUserId(req, res, next) {}
function validUser(req, res, next) {}
function validatePost(req, res, next) {}

server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

server.use((req, res) => {
  res.status(404).json({message: "You have reached an invalid URL"})
})

function logger(req, res, next) {
  const today = new Date().toISOString()
  console.log(`A new [${req.method}] request was made to [${req.url}] at [${today}]`)
  next();
}

module.exports = server;