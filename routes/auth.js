const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');


router.get('/signup', (req, res, next) => {
    res.render('signup')
})

//check sign up
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    if(password.length < 8) {
        res.render('signup', { message: 'Your password has to be 8 chars min'})
        return
    }

    if(username === '') {
        res.render('signup', { message: 'Username is required' })
        return
    }

    User.findOne({ username: username })
      .then(userFromDB => {
          if(userFromDB !== null) {
              res.render('signup', { message: 'This username already exists' })
          } else {
              const salt = bcrypt.genSaltSync();
              const hash = bcrypt.hashSync(password, salt);

              User.create({
                  username: username,
                  password: hash
              })
              .then(createdUser => {
                  console.log(createdUser)
                  res.redirect('/')
              })
          }
      })
})


module.exports = router;