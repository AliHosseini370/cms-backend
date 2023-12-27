import { Request, Response } from "express";
import { User, IUser } from "../models/userModel";
import validator from 'validator';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const createToken = async (_id: string): Promise<string> => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: '3 days'})
}

const getUsers = async (req: Request, res:Response): Promise<void> => {
    const { storeId } = req.params
    try {
        const users: IUser[] = await User.find({storeId}).sort({ createdAt: -1})
        if (!users) {
            return void res.status(404).json({error: 'Cant find any users'})
        } 
        res.status(200).json(users)
    } catch (error: any) {
        res.status(500).json({error: error.message})
    }
}


const getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const user: IUser | null = await User.findById(id)
        if (!user) {
            return void res.status(404).json({error: 'Cant find this user'})
        } 
        res.status(200).json(user)
    } catch (error: any) {
        res.status(500).json({error: error.message}) 
    }
}


const createUser = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    const { fullName, email, password, phoneNumber, } = req.body
    if (!validator.isEmail(email)) {
        return void res.status(400).json({error: 'Enter a Valid Email'})
    }
    if (!validator.isStrongPassword(password)) {
        return void res.status(400).json({error: 'Enter a Strong Password (use uppercase, numbers and symbols)'})
    }
    try {
        const exists: IUser | null = await User.findOne({ $or : [ {email}, {phoneNumber} ]})
        if (exists) {
            if (exists.email === email) {
                return void res.status(400).json({error: 'Email Already Exists'})
            }
            if (exists.phoneNumber === phoneNumber) {
                return void res.status(400).json({error: 'PhoneNumber Already Exists'})
            }
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const user: IUser = await User.create({fullName, email, password: hash, phoneNumber, storeId})
        if (!user) {
            return void res.status(400).json({error: 'Error While Creating User'})
        }
        const token = await createToken((user as any)._id)
        res.status(201).json({email, token})
    } catch (error: any) {
        res.status(500).json({error: error.message})
    }
}

const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            return void res.status(404).json({eror: 'Incorrect Email'})
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return void res.status(400).json({error: 'Incorrect Password'})
        }
        if (!user.isAdmin) {
            return void res.status(401).json({error: 'Authorization Error (User Is Not Admin)'})
        }
        const token = await createToken((user as any)._id)
        res.status(200).json({email, token})
    } catch (error: any) {
        res.status(500).json({error: error.message}) 
    }
}

const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    const { fullName, email, password, phoneNumber, isAdmin } = req.body
    try {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const user: IUser | null = await User.findByIdAndUpdate(id, {fullName, email, password: hash, phoneNumber, isAdmin}, { new: true })
        if (!user) {
            return void res.status(404).json({error: 'Error White Updating User'})
        } 
        res.status(200).json(user)
    } catch (error: any) {
        res.status(500).json({error: error.message}) 
    }
}

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const user  = await User.findByIdAndDelete(id)
        if (!user) {
            return void res.status(404).json({error: 'Error White Deleting User'})
        } 
        res.status(200).json(user)
    } catch (error: any) {
        res.status(500).json({error: error.message}) 
    }
}

export { getUsers, getUser, createUser, loginAdmin, updateUser, deleteUser }