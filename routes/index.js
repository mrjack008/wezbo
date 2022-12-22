var express = require('express');
const { userLogin, userSignup, userLoginCheck, userHomePage, hai, clearCookie, forget, forgot, reset, reseted, admin, admincheck, adminindex, deleteUsers } = require('../controller/userhome');
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

//<---------------------------------Admin functions ------------------------------->

router.get('/admin',admin);
router.post('/admin',admincheck)
router.get('/admin/index',adminindex)
router.get('/admin/delete-user/:id',deleteUsers)


module.exports = router;
