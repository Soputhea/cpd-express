const express = require('express')
const {loginUser, signupUser, showGoogleOAuthScreen, handleGoogleLogin } = require('../controllers/auth')
const { handleValidation, loginLimit } = require('../middlewares/index');
const { loginSchema, createUserShema } = require('../common/validation/index')

const authRoute = express.Router()


authRoute.post('/login' , loginSchema, handleValidation, loginUser)
authRoute.post('/signup', createUserShema, handleValidation, signupUser )
authRoute.get('/show-google-oauth', showGoogleOAuthScreen)
authRoute.get('/google-callback', handleGoogleLogin)


module.exports = authRoute




