const express = require('express');

const router = express.Router();

const db = require("./postDb")

router.get('/', (req, res) => {
  db.get()
  .then(posts => {
    res.status(200).json({posts: posts})
  })
  .catch(error => {
    res.status(500).json({message: "could not retrieve data"})
  })
});

router.get('/:id', getId, (req, res) => {
  const id = req.params.id
  db.getById(id)
  .then(post => {
      if (post.length == 0) {
          res.status(404).json({error: "The post with the specified ID does not exist."})
      } else {
          res.status(200).json(post);
      }
  })
  .catch(error => {
      res.status(500).json({error: "The posts information could not be retrieved."}).end()
  })
});

router.delete('/:id', getId, (req, res) => {
  const id = req.params.id
  db.remove(id)
  .then(post => {
      if (post) {
          res.status(200).json(`succesfully deleted post ${id}`);
      } else {
          res.status(404).json({error: "The post with the specified ID does not exist."})
      }
  })
});

router.put('/:id', getId, (req, res) => {
  const id = req.params.id
  let post = req.body
  if(!post.text){
      res.status(400).json({message: 'Please provide for the post.' })
  } else {
      db.update(id, post)
      .then(post => {
          if (post) {
              res.status(200).json(post)
          } else {
              res.status(404).json({ message: 'The post with the specified ID does not exist, please try again.' })
          }
      }).catch(error => {
          res.status(500).json({ error: 'The post information could not be modified' })
      })
  }
});

function getId(req, res, next){
  let idArray = []
  let id = req.params.id
  db.get()
  .then(posts => {
    posts.map(post => {
      // console.log(post.id)
      idArray.push(post.id)
      // console.log(idArray);
    })
    function validatePostId(id, idArray){
      console.log(id)
      console.log(idArray)
      if (idArray.find(id)){
        console.log(`MATCHES!: ${id}`)
      } else {
        console.log(`DOES NOT MATCH!: ${id}` )
      }
    }
    validatePostId(id, idArray)
    next()
  })
}

module.exports = router;