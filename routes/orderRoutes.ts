import express from 'express'
import { getOrders, getOrder, createPayment, updateOrder, deleteOrder } from '../controllers/orderController'
import requireAdminAuth from '../middleware/requireAdminAuth'
const router = express.Router()


//get all orders of a store
router.get('/:storeId/orders', requireAdminAuth, getOrders)

//get a single order
router.get('/orders/:id', requireAdminAuth, getOrder)

//create a new order in a store
router.post('/:storeId/orders', createPayment)

//callback route
router.get('/orders/callback')

//Update / Patch store
router.patch('/orders/:id', requireAdminAuth, updateOrder)

//Delete order
router.delete('/orders/:id', requireAdminAuth, deleteOrder)

export default router