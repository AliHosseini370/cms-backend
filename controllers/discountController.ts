import { Request, Response } from "express";
import { Discount, IDiscount } from "../models/discountModel";


//Get all discounts of store
const getDiscounts = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    try {
        const discounts: IDiscount[] = await Discount.find({storeId}).sort({ createdAt: -1})
        if (!discounts) {
            return void res.status(404).json({error: 'Cant Find Any Discounts In This Store'})
        }
        res.status(200).json(discounts)
    } catch (error: any) {
        console.log('Error While Getting Discounts From Store:', error)
        res.status(500).json({error: error.message})
    }
}

//Get a single discount
const getDiscount = async (req: Request, res: Response): Promise<void> => {
    const { discountcode } = req.params
    try {
        const discount: IDiscount | null = await Discount.findOne({code: discountcode})
        if (!discount) {
            return void res.status(404).json({error: 'Discount code is invalid'})
        }
        res.status(200).json(discount)
    } catch (error: any) {
        console.log('Error While Getting Discount From Store:', error)
        res.status(500).json({error: error.message})
    }
}

//Create Discount
const createDiscount = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    const { title, code, amount } = req.body
    try {
        const discount: IDiscount = await Discount.create({title, code, amount, storeId})
        if (!discount) {
            return void res.status(500).json({error: 'Server Error While Creating Discount'})
        }
        res.status(201).json(discount)
    } catch (error: any) {
        console.log('Error While Creating Discount:', error)
        res.status(500).json({error: error.message})
    }
}

//Update Discount
const updateDiscount = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const updateddiscount: IDiscount | null = await Discount.findByIdAndUpdate(id, req.body, { new: true })
        if (!updateddiscount) {
            return void res.status(404).json({error: 'Server Error While Updating Discount'})
        }
        res.status(200).json(updateddiscount)
    } catch (error: any) {
        console.log('Error While Updating Discount From Store:', error)
        res.status(500).json({error: error.message})
    }
}

//Delete Discount
const deleteDiscount = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const deleteddiscount  = await Discount.findByIdAndDelete(id)
        if (!deleteddiscount) {
            return void res.status(404).json({error: 'Server Error While Deleting Discount'})
        }
        res.status(200).json(deleteddiscount)
    } catch (error: any) {
        console.log('Error While Deleting Discount From Store:', error)
        res.status(500).json({error: error.message})
    }
}

export { getDiscounts, getDiscount, createDiscount, updateDiscount, deleteDiscount }