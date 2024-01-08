import { Request, Response } from "express";
import { Category, ICategory } from "../models/categoryModel";
import mongoose from "mongoose";


//get Categories of a store
const getCategories = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    try {
        const categories: ICategory[] = await Category.find({storeId}).sort({ createdAt: -1}).populate('billboard').populate({path: 'products', model: 'Product', populate: [{path: 'color', model: 'Color'}, {path: 'size', model: 'Size'}]})
        if (!categories) {
            return void res.status(404).json({error: 'cant find any categories'})
        }
        res.status(200).json(categories)
    } catch (error: any) {
        console.log('Error While Getting categories:', error);
        res.status(500).json({error: error.message})
    }
}

//get a Category
const getCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const category: ICategory | null = await Category.findById(id).populate('billboard').populate('products')
        if (!category) {
            return void res.status(404).json({error: 'cant find any billboard'})
        }
        res.status(200).json(category)
    } catch (error: any) {
        console.log('Error While Getting category:', error);
        res.status(500).json({error: error.message})
    }
}

//create a category
const createCategory = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    const { title, billboard } = req.body
    try {
        const category: ICategory = await Category.create({title, billboard: new mongoose.Types.ObjectId(billboard), storeId})
        if (!category) {
            return void res.status(500).json({error: 'Somthing went wrong while creating category'})
        }
        res.status(201).json(category)
    } catch (error: any) {
        console.log('Error While Creating category:', error);
        res.status(500).json({error: error.message})  
    }
}

//update and patch
const updateCategory= async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const updatedCategory: ICategory | null = await Category.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedCategory) {
            return void res.status(404).json({error: 'Somthing went wrong while updating Category'})
        }
        res.status(200).json(updatedCategory)
    } catch (error: any) {
        console.log('Error While Updating Category:', error);
        res.status(500).json({error: error.message})
    }
}

//delete a billboard
const deleteCategory= async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const deletedCategory = await Category.findByIdAndDelete(id)
        if (!deletedCategory) {
            return void res.status(404).json({error: 'Somthing went wrong while deleting Category'})
        }
        res.status(200).json(deletedCategory)
    } catch (error: any) {
        console.log('Error While deleting Category:', error);
        res.status(500).json({error: error.message})
    }
}

export { getCategories, getCategory, createCategory, updateCategory, deleteCategory }