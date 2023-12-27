import express from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController'
import requireAdminAuth from '../middleware/requireAdminAuth'
const router = express.Router()

//Get all Products of a store
router.get('/:storeId/products', getProducts)

//Get a product
router.get('/products/:id', getProduct)

//Create product
router.post('/:storeId/products', requireAdminAuth, createProduct)

//Update And Patch Product
router.patch('/products/:id', requireAdminAuth, updateProduct)

//Delete Product
router.delete('/products/:id', requireAdminAuth, deleteProduct)

export default router