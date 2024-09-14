const express = require('express')

const { getUser, getUsers,deleteUserById, createUser, getTweetByUserId, updateUserById  } = require('../controllers/users')
const router = express.Router()
const passport = require('passport');
const { idValidator, authorize } = require('../middlewares')


router.get('/', getUsers)
router.post('/', createUser)
router.get('/:id', getUser)
router.delete('/:id', authorize('delete_record'), deleteUserById)
// router.get("/:id/tweet", getTweetByUserId )
router.put("/:id", updateUserById )

module.exports = router