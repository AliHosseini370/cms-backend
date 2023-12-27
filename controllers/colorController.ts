import { Request, Response } from 'express'
import { Color, IColor } from '../models/colorModel'



//Get all colors of store
const getColors = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    try {
        const colors: IColor[] = await Color.find({storeId}).sort({ createdAt: -1})
        if (!colors) {
            return void res.status(404).json({error: 'Cant find any colors in this store'})
        }
        res.status(200).json(colors)
    } catch (error: any) {
        console.log('Error While Getting Colors Of Store:',error)
        res.status(500).json({error: error.message})
    }
}

//Get a single color
const getColor = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const color: IColor | null = await Color.findById(id)
        if (!color) {
            return void res.status(404).json({error: 'Cant find this color'})
        }
        res.status(200).json(color)
    } catch (error: any) {
        console.log('Error While Getting Colors Of Store:',error)
        res.status(500).json({error: error.message})
    }
}

//Create a new color
const createColor = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    const { title, value } = req.body
    try {
        const color: IColor = await Color.create({title, value, storeId})
        if (!color) {
            return void res.status(500).json({error: 'Cant create this color'})
        }
        res.status(201).json(color)
    } catch (error: any) {
        console.log('Error While Creating This Color:',error)
        res.status(500).json({error: error.message}) 
    }
}

//Update/Patch Color
const updateColor = async (req: Request, res:Response): Promise<void> => {
    const { id } = req.params
    try {
        const updatedColor: IColor | null = await Color.findByIdAndUpdate(id, req.body, { new: true})
        if (!updatedColor) {
            return void res.status(500).json({error: 'Cant update this color'})
        }
        res.status(200).json(updatedColor)
    } catch (error: any) {
        console.log('Error While Updating This Color:',error)
        res.status(500).json({error: error.message}) 
    }
}

//Delete Color
const deleteColor = async (req: Request, res:Response): Promise<void> => {
    const { id } = req.params
    try {
        const deletedColor = await Color.findByIdAndDelete(id)
        if (!deletedColor) {
            return void res.status(500).json({error: 'Cant delete this color'})
        }
        res.status(200).json(deletedColor)
    } catch (error: any) {
        console.log('Error While Deleting This Color:',error)
        res.status(500).json({error: error.message}) 
    }
}


export { getColors, getColor, createColor, updateColor, deleteColor}