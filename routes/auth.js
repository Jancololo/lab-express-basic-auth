const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

//GET signup page
router.get('/signup', (req, res, next) => {
    res.render('signup')
})

//GET login page
router.get('/login', (req, res, next) => {
    res.render('login');
})

//POST login
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB === null) {
                res.render('login', { message: 'Invalid credentials' });
                return;
            } else if (bcrypt.compareSync(password, userFromDB.password)) {
                req.session.user = userFromDB;
                res.redirect('/profile')
            }
        })
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


//log out
router.get('/logout', (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.redirect('/');
        }
    })
})


module.exports = router;