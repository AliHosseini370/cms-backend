import { Request, Response } from 'express'
import {Store, IStore} from '../models/storeModel'


const getStores = async (req: Request, res: Response): Promise<void> => {
    try {
        const stores: IStore[] | null = await Store.find({}).sort({createdAt: -1})
        if (!stores) {
            return void res.status(404).json({error: 'cant find any stores'})
        }
        res.status(200).json(stores)
    } catch (error: any) {
        console.error('Error in gettingStores:', error);
        return void res.status(400).json({error: error.message})
    }
}

//get a single store
const getStore = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const store: IStore | null = await Store.findById(id)
        if (!store) {
            return void res.status(404).json({error: 'No Such Store'})
        }
        res.status(200).json(store)
    } catch (error: any) {
        console.error('Error in gettingStore:', error);
        return void res.status(400).json({error: error.message})
    }
}

//create a new store
const createStore = async (req: Request, res: Response): Promise<void> => {
    const { storeName, merchantCode, storeEmail } = req.body
    try {
        const store: IStore | null = await Store.create({storeName, merchantCode, storeEmail})
        if (!store) {
            return void res.status(500).json({error: 'Somthing Went Wrong'})
        }
        res.status(201).json(store)
    } catch (error: any) {
        console.error('Error in creatingStore:', error);
        return void res.status(500).json({error: error.message}) 
    }
}

//update store
const updateStore = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const updatedStore: IStore | null = await Store.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedStore) {
            return void res.status(500).json({error: 'Somthing Went Wrong'}) 
        }
        res.status(200).json(updatedStore)
    } catch (error:any) {
        console.error('Error in updatingStore:', error);
        return void res.status(500).json({error: error.message}) 
    }
}

//delete store
const deleteStore = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const deletedStore = await Store.findByIdAndDelete(id)
        if (!deletedStore) {
            return void res.status(500).json({error: 'Somthing Went Wrong'}) 
        }
        res.status(200).json(deletedStore)
    } catch (error:any) {
        console.error('Error in deleteStore:', error);
        return void res.status(500).json({error: error.message}) 
    }
}

export {
    getStores, getStore, createStore, updateStore, deleteStore
}