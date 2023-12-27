import { Request, Response } from 'express'
import { Size, ISize } from '../models/sizeModel'



//Get all Sizes of store
const getSizes = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    try {
        const sizes: ISize[] = await Size.find({storeId}).sort({ createdAt: -1})
        if (!sizes) {
            return void res.status(404).json({error: 'Cant find any sizes in this store'})
        }
        res.status(200).json(sizes)
    } catch (error: any) {
        console.log('Error While Getting sizes Of Store:',error)
        res.status(500).json({error: error.message})
    }
}

//Get a single Size
const getSize = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const size: ISize | null = await Size.findById(id)
        if (!size) {
            return void res.status(404).json({error: 'Cant find this size'})
        }
        res.status(200).json(size)
    } catch (error: any) {
        console.log('Error While Getting size Of Store:',error)
        res.status(500).json({error: error.message})
    }
}

//Create a new Size
const createSize = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    const { title, value } = req.body
    try {
        const size: ISize = await Size.create({title, value, storeId})
        if (!size) {
            return void res.status(500).json({error: 'Cant create this size'})
        }
        res.status(201).json(size)
    } catch (error: any) {
        console.log('Error While Creating This size:',error)
        res.status(500).json({error: error.message}) 
    }
}

//Update/Patch Size
const updateSize = async (req: Request, res:Response): Promise<void> => {
    const { id } = req.params
    try {
        const updatedSize: ISize | null = await Size.findByIdAndUpdate(id, req.body, { new: true})
        if (!updatedSize) {
            return void res.status(500).json({error: 'Cant update this size'})
        }
        res.status(200).json(updatedSize)
    } catch (error: any) {
        console.log('Error While Updating This Size:',error)
        res.status(500).json({error: error.message}) 
    }
}

//Delete Size
const deleteSize = async (req: Request, res:Response): Promise<void> => {
    const { id } = req.params
    try {
        const deletedSize = await Size.findByIdAndDelete(id)
        if (!deletedSize) {
            return void res.status(500).json({error: 'Cant delete this size'})
        }
        res.status(200).json(deletedSize)
    } catch (error: any) {
        console.log('Error While Deleting This size:',error)
        res.status(500).json({error: error.message}) 
    }
}


export { getSizes, getSize, createSize, updateSize, deleteSize}