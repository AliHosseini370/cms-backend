import mongoose from "mongoose";

interface IUser {
    fullName: string,
    email: string,
    password: string,
    phoneNumber: string,
    isAdmin? : boolean,
    storeId: mongoose.Types.ObjectId
}


const userSchema = new mongoose.Schema<IUser>({
    fullName: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const User = mongoose.model('User',userSchema)

export { User, IUser}