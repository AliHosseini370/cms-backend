import express from 'express'
import { getUsers, getUser, createUser, updateUser, deleteUser, loginAdmin } from '../controllers/userController'
import requireAdminAuth from '../middleware/requireAdminAuth'
const router = express.Router()


//get all users
router.get('/:storeId/users', requireAdminAuth, getUsers)

//get a user
router.get('/users/:id', requireAdminAuth, getUser)

//create user
router.post('/:storeId/users', createUser)

//admin login
router.post('/users/adminlogin', loginAdmin)

//update / patch user
router.patch('/users/:id', requireAdminAuth, updateUser)

//delete user
router.delete('/users/:id', requireAdminAuth, deleteUser)

export default router