import exress from 'express'
import { getSizes, getSize, createSize, updateSize, deleteSize } from '../controllers/sizeController'
import requireAdminAuth from '../middleware/requireAdminAuth'
const router = exress.Router()


//get all Sizes of a store
router.get('/:storeId/sizes', getSizes)

//get a Size
router.get('/sizes/:id', getSize)

//create a Size
router.post('/:storeId/sizes', requireAdminAuth, createSize)

//Patch/Update a Size
router.patch('/sizes/:id', requireAdminAuth, updateSize)

//Delete Size
router.delete('/sizes/:id', requireAdminAuth, deleteSize)

export default router