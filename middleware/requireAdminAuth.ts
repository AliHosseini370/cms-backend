import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { IUser, User } from "../models/userModel"


interface CustomRequest extends Request {
    user?: IUser
}

const requireAdminAuth = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'})
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in the environment variables.');
        }
        const {_id} : any = await jwt.verify(authorization, process.env.JWT_SECRET)
        const user: IUser | null = await User.findById(_id)
        if (!user) {
            return res.status(401).json({error: 'User not found'})
        }
        if (!user.isAdmin) {
            return res.status(403).json({error: 'access denied'})
        }
        req.user = user
        next()
    } catch (error : any) {
        console.log(error.message);
        res.status(401).json({ error: 'Request is not authorized' });
    }
}

export default requireAdminAuth