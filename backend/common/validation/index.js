const { checkSchema } = require("express-validator");
const User = require('../../models/user')

const loginSchema = checkSchema({
  email: {
    isEmail: true,
    errorMessage: "Invalid email address",
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should be at least 8 chars",
    },
  }
});

const createUserShema = checkSchema({
  firstname:{
    isLength: {
      options: [{ min: 2, max: 10 }],
      errorMessage: 'Must be between 2 and 20 chars long'
    },
    errorMessage: 'Invalid firstname'
  },
  lastname:{
    isLength: {
      options: [{ min: 2, max: 10 }],
      errorMessage: 'Must be between 2 and 20 chars long'
    },
    errorMessage: 'Invalid lastname'
  },  
  email:{
    isEmail: true,
    custom:{
      options: async (value) =>{
        const user = await User.findOne({email: value})
        if(user){
          throw new Error( `User with email: ${value} is existed! `)
        }
      }
    },
    errorMessage: "Invalid email address",
  },
  password:{
    isLength: {
      options:{
        max:30,
        min:6
      },
      errorMessage: 'Password must contain at least 30 characters',
    },
  },
  comfirmedPassword: {
    isLength: {
      options:{
        max:30,
        min:6
      },
      errorMessage: 'Password must contain at least 30 characters',
    },
    custom: {
      options: async (value, {req})=>{
        if(value!= req.body.password){
          throw new Error("Password mismatched!")
        }
      }
    }
  },
})

const updateUserShema = checkSchema({
  firstname:{
    isLength: {
      options: [{ min: 2, max: 10 }],
      errorMessage: 'Must be between 2 and 20 chars long'
    },
    errorMessage: 'Invalid firstname'
  },
  lastname:{
    isLength: {
      options: [{ min: 2, max: 10 }],
      errorMessage: 'Must be between 2 and 20 chars long'
    },
    errorMessage: 'Invalid lastname'
  },
  email:{
    isEmail: true,
    custom:{
      options: async (value) =>{
        const user = await User.findOne({email: value})
        if(user){
          throw new Error( `User with email: ${value} is existed! `)
        }
      }
    },
    errorMessage: "Invalid email address",
  },
  password:{
    isLength: {
      options:{
        max:30,
        min:6
      },
      errorMessage: 'Password must contain at least 30 characters',
    },
  },
  comfirmedPassword: {
    isLength: {
      options:{
        max:30,
        min:6
      },
      errorMessage: 'Password must contain at least 30 characters',
    },
    custom: {
      options: async (value, {req})=>{
        if(value!= req.body.password){
          throw new Error("Password mismatched!")
        }
      }
    }
  },
})


module.exports = {loginSchema, createUserShema, updateUserShema}