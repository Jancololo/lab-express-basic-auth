const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

//check if the user is logged in
const loginCheck = () => {
    return (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/login')
        }
    }
}

//GET profile
router.get('/profile', (req, res, next) => {
    //console.log(req.session.user)
    res.render('profile');
})

module.exports = router;
