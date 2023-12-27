import express from 'express'
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController'
import requireAdminAuth from '../middleware/requireAdminAuth'
const router = express.Router()

//Get all Products of a category
router.get('/:storeId/categories', getCategories)

//Get a category
router.get('/categories/:id', getCategory)

//Create category
router.post('/:storeId/categories', requireAdminAuth, createCategory)

//Update And Patch category
router.patch('/categories/:id', requireAdminAuth, updateCategory)

//Delete category
router.delete('/categories/:id', requireAdminAuth, deleteCategory)

export default router