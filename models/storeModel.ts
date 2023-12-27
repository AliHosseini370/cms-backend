import mongoose from "mongoose";

interface IStore {
    storeName: string,
    merchantCode: string,
    storeEmail: string
}

const storeSchema = new mongoose.Schema<IStore> ({
    storeName : {
        type: String,
        required: true
    },
    merchantCode: {
        type: String,
        required: true
    },
    storeEmail: {
        type: String,
        required: true
    },
}, {timestamps : true})

const Store = mongoose.model('Store', storeSchema)

export { Store, IStore}