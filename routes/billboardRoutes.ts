import express from 'express'
import { getBillBoards, getBillBoard, createBillBoard, updateBillBoard, deleteBillBoard } from '../controllers/billboardController'
import requireAdminAuth from '../middleware/requireAdminAuth'
const router = express.Router()


//get all billboards
router.get('/:storeId/billboards', getBillBoards)

//get a billboard
router.get('/billboards/:id', getBillBoard)

//create a billboard
router.post('/:storeId/billboards', requireAdminAuth, createBillBoard)

//Update and Patch
router.patch('/billboards/:id', requireAdminAuth, updateBillBoard)

//Delete
router.delete('/billboards/:id', requireAdminAuth, deleteBillBoard)

export default router