var express = require('express');
const { userLogin, userSignup, userLoginCheck, userHomePage, hai, clearCookie, forget, forgot, reset, reseted } = require('../controller/userhome');
var router = express.Router();

/* GET home page. */



//<---------------------------------Home Page ------------------------------->

router.get('/indexpage',userHomePage);
router.get('/clear',clearCookie);


//<---------------------------------Login functions ------------------------------->

router.get('/login',userLogin)
router.post('/home',userSignup)
router.post('/home1',userLoginCheck)

//<---------------------------------Password functions ------------------------------->

router.get('/forgot-password',forget)
router.post('/forgot-password',forgot)
router.get('/reset-password/:id/:token',reset)
router.post('/reset-password/:id/:token',reseted)


module.exports = router;
