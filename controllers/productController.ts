import { Request, Response } from "express";
import { Product, IProduct } from "../models/productModel";
import { Category, ICategory } from "../models/categoryModel";
import mongoose from "mongoose";


const stringToId = async (id: string): Promise<mongoose.Types.ObjectId> => {
    return  new mongoose.Types.ObjectId(id)
}


//get a stores products
const getProducts = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    try {
        const products: IProduct[] = await Product.find({storeId}).sort({ createdAt: -1}).populate('category').populate('color').populate('size').populate('storeId')
        if (!products) {
            return void res.status(404).json({error: 'Cant Find Any products'})
        }
        res.status(200).json(products)
    } catch (error: any) {
        console.log('Eror While Getting The Products:', error);
        return void res.status(500).json({error: error.message})
    }
}

//get a single product
const getProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const product: IProduct | null = await Product.findById(id).populate('category').populate('color').populate('size').populate('storeId')
        if (!product) {
            return void res.status(404).json({error: 'Cant Find Any products'})
        }
        res.status(200).json(product)
    } catch (error: any) {
        console.log('Eror While Getting A Product:', error);
        return void res.status(500).json({error: error.message})
    }
}

//create products
const createProduct = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    const { title, images, price, category, color, size, quantity, featured, archived } = req.body
    try {
        const product: IProduct = await Product.create({title, images, price, category: await stringToId(category), color: await stringToId(color), size: await stringToId(size), quantity, featured, archived, storeId})
        if (!product) {
            return void res.status(500).json({error: 'Somthing Went Wrong While Creating The Product'})
        }
        const updateCategoryProducts: ICategory | null = await Category.findByIdAndUpdate({_id: await stringToId(category)}, { $push: { products: (product as any)._id}}, { new: true })
        if (!updateCategoryProducts) {
            return void res.status(500).json({error: 'Somthing Went Wrong While pushing the product to category document'})
        }
        res.status(201).json(product)
    } catch (error: any) {
        console.log('Eror While Creating A Product:', error);
        return void res.status(500).json({error: error.message})
    }
}

//Update And Patch a Product
const updateProduct = async ( req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const updatedProduct: IProduct | null = await Product.findByIdAndUpdate(id, req.body, { new: true})
        if (!updatedProduct) {
            return void res.status(500).json({error: 'Somthing Went Wrong While Creating The Product'})
        }
        res.status(200).json(updatedProduct)
    } catch (error: any) {
        console.log('Eror While Updating A Product:', error);
        return void res.status(500).json({error: error.message})
    }
}

//Delete Product
const deleteProduct = async ( req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            return void res.status(500).json({error: 'Somthing Went Wrong While Creating The Product'})
        }
        res.status(200).json(deletedProduct)
    } catch (error: any) {
        console.log('Eror While Deleting A Product:', error);
        return void res.status(500).json({error: error.message})
    }
}

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct}