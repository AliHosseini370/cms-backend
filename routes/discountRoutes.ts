import express from 'express'
import { getDiscounts, getDiscount, createDiscount, updateDiscount, deleteDiscount } from '../controllers/discountController'
import requireAdminAuth from '../middleware/requireAdminAuth'
const router = express.Router()

//Get All Discrounts Of A Store
router.get('/:storeId/discounts', requireAdminAuth, getDiscounts)

//Get And Check Dsicount
router.get('/discounts/:discountcode', getDiscount)

//Create Discount
router.post('/:storeId/discounts', requireAdminAuth, createDiscount)

//Update And Patch Discount
router.patch('/discounts/:id', requireAdminAuth, updateDiscount)

//Delete Discount
router.delete('/discounts/:id', requireAdminAuth, deleteDiscount)



export default router