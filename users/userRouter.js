const express = require('express');

const router = express.Router();

const db = require('./userDb');
const postdb = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  db.insert(req.body)
  .then(post => {
          res.status(201).json(post)
  }).catch(error=>{
      console.log(error)
      res.status(500).json({errormessage: 'error getting data'})
  })
});

router.get('/', (req, res) => {
  db.get()
  .then(users => {
    res.status(200).json({users: users})
  })
  .catch(error => {
    res.status(500).json({message: "could not retrieve user data"})
  })
});

router.get('/:id', validateUserId,(req, res) => {
  const id = req.params.id
  db.getById(id)
  .then(users => {
      if (users.length == 0) {
          res.status(404).json({error: "The post with the specified ID does not exist."})
      } else {
          res.status(200).json(users);
      }
  })
  .catch(error => {
      res.status(500).json({error: "The posts information could not be retrieved."}).end()
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id
  db.getUserPosts(id)
  .then(post => {
      res.status(201).json(post)
  }).catch(error=>{
      console.log(error)
      res.status(500).json({errormessage: 'error getting data'})
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const id = req.params.id
  let post = {
    user_id: id,
    text: req.body.text,
  }
  postdb.insert(post)
  .then(post => {
      res.status(201).json(post)
  }).catch(error=>{
      console.log(error)
      res.status(500).json({errormessage: 'error getting data'})
  })
});

router.delete('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id
  db.remove(id)
  .then(res.status(200).json({message: 'User was deleted!'}))
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id
  let post = {
    name: req.body.name,
  }
  db.update(id, post)
  .then(post => {
        res.status(200).json(post)
  }).catch(error => {
      res.status(500).json({ error: 'The post information could not be modified' })
  })
});





//custom middleware

function validateUserId(req, res, next) {
  id = req.params.id
  var userIds = []
  db.get()
  .then(response => {
    response.map(user => {
      userIds.push(Number(user.id))
    })
    // console.log('Final', userIds)
    if (!userIds.includes(Number(id))) {
      res.status(404).json({message: "user with this id does not exist"})
    } else {
      next()
    }
  })
}

function validateUser(req, res, next) {
  console.log(req.body)
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({message: 'missing post data'})
  } else if (!req.body.name) {
    res.status(400).json({message: 'missing required name field'}).end()
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  if(!req.body){
      res.status(400).json({errorMessage: "error getting body!."})
  } else if(!req.body.text){
      res.status(400).json({errorMessage: "Please provide text/name for the comment."})
  } else {
    next()
  }
}

module.exports = router;
