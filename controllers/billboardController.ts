import { Request, Response } from "express";
import { BillBoard, IBillboard } from "../models/billboardModel";


//get Billboards of a store
const getBillBoards = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    try {
        const billboards: IBillboard[] = await BillBoard.find({storeId}).sort({ createdAt: -1})
        if (!billboards) {
            return void res.status(404).json({error: 'cant find any billboards'})
        }
        res.status(200).json(billboards)
    } catch (error: any) {
        console.log('Error While Getting BillBoards:', error);
        res.status(500).json({error: error.message})
    }
}

//get a BillBoard
const getBillBoard = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const billboard: IBillboard | null = await BillBoard.findById(id)
        if (!billboard) {
            return void res.status(404).json({error: 'cant find any billboard'})
        }
        res.status(200).json(billboard)
    } catch (error: any) {
        console.log('Error While Getting BillBoard:', error);
        res.status(500).json({error: error.message})
    }
}

//create a billboard
const createBillBoard = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    const { lable, image } = req.body
    try {
        const billboard: IBillboard = await BillBoard.create({lable, image, storeId})
        if (!billboard) {
            return void res.status(500).json({error: 'Somthing went wrong while creating billboard'})
        }
        res.status(201).json(billboard)
    } catch (error: any) {
        console.log('Error While Creating BillBoard:', error);
        res.status(500).json({error: error.message})  
    }
}

//update and patch
const updateBillBoard = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const updatedBillboard: IBillboard | null = await BillBoard.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedBillboard) {
            return void res.status(404).json({error: 'Somthing went wrong while updating billboard'})
        }
        res.status(200).json(updatedBillboard)
    } catch (error: any) {
        console.log('Error While Updating BillBoard:', error);
        res.status(500).json({error: error.message})
    }
}

//delete a billboard
const deleteBillBoard = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const deletedBillboard = await BillBoard.findByIdAndDelete(id)
        if (!deletedBillboard) {
            return void res.status(404).json({error: 'Somthing went wrong while Deleting billboard'})
        }
        res.status(200).json(deletedBillboard)
    } catch (error: any) {
        console.log('Error While Deleting BillBoard:', error);
        res.status(500).json({error: error.message})
    }
}

export { getBillBoard, getBillBoards, createBillBoard, updateBillBoard, deleteBillBoard }