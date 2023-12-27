import { Order, IOrder } from '../models/orderModel'
import { Request, Response } from 'express'
import { Store, IStore } from '../models/storeModel';
import axios from 'axios';


//get orders of a store
const getOrders = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.body
    try {
        const orders: IOrder[] = await Order.find({storeId}).sort({ createdAt: -1}).populate('products')
        if (!orders) {
            return void res.status(404).json({error: 'Cant find any orders in this store'})
        }
        res.status(200).json(orders)
    } catch (error: any) {
        console.log('Error White Getting Orders:', error)
        res.status(500).json({error: error.message})
    }
}

//get order of a store
const getOrder = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body
    try {
        const order: IOrder | null = await Order.findById(id).populate('products')
        if (!order) {
            return void res.status(404).json({error: 'Cant find this order'})
        }
        res.status(200).json(order)
    } catch (error: any) {
        console.log('Error White Getting Order:', error)
        res.status(500).json({error: error.message})
    }
}

const createPayment = async (req: Request, res: Response): Promise<void> => {
    const { storeId } = req.params
    const { fullName, email, phoneNumber, products, totalPrice, address, zipCode } = req.body
    try {
        const store: IStore | null = await Store.findById(storeId)
        if (!store) {
            return void res.status(500).json({error: 'Somthing went wrong while getting the store merchant'})
        }
        const order: IOrder = await Order.create({fullName, email, phoneNumber, products, totalPrice, address, zipCode, storeId})
        if (!order) {
            return void res.status(500).json({error: 'Error While Creating New Order'})
        }
        const encodedStoreMerchant = encodeURIComponent(store.merchantCode)
        const encodedOrderId = encodeURIComponent((order as any)._id)
        const encodedTotalPrice = encodeURIComponent(totalPrice)
        const paymentUrl = await axios.post('https://api.zarinpal.com/pg/v4/payment/request.json', {
            merchant_id: store.merchantCode,
            amount: totalPrice,
            currency: 'IRT',
            description: `خرید ${products}`,
            callback_url: `${process.env.CALL_BACK_URL}?merchant=${encodedStoreMerchant}&orderid=${encodedOrderId}&totalprice=${encodedTotalPrice}`,
            metadata: [
                phoneNumber,
                email
            ],
        })
        if (paymentUrl.data.data.code !== 100) {
            return void res.status(500).json({error: 'Error White Creating Payment Link'})
        }
        res.status(200).json(paymentUrl.data.data)
    } catch (error: any) {
        console.log('Error While Creating Payment Link:', error)
        res.status(500).json({error: error.message})
    }
}

//create new order
const createOrder = async (req: Request, res: Response): Promise<void> => {
    const { authority, Status, merchant, orderid, totalPrice } = req.query
    const price = Number(totalPrice)
    try {
        const verifyPayment = await axios.post('https://api.zarinpal.com/pg/v4/payment/verify.json', {
            authority: authority,
            merchant_id: merchant,
            amount: totalPrice,
        })
        if (verifyPayment.data.data.code !== 100) {
            return void res.redirect('https://google.com')
        }
        const updateOrder: IOrder | null = await Order.findByIdAndUpdate(orderid, {paid: true})
        if (!updateOrder) {
            return void res.status(500).json({error: 'Error While Updating Payment Statuts'})
        }
        res.redirect('https://bing.com')
    } catch (error: any) {
        console.log('Error While Creating New Order:', error)
        res.status(500).json({error: error.message})
    }
}


const updateOrder = async (req:Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const updatedOrder: IOrder | null = await Order.findByIdAndUpdate(id, req.body, { new:true })
        if (!updatedOrder) {
            return void res.status(500).json({error: 'Error While Updating Order'})
        }
        res.status(200).json(updatedOrder)
    } catch (error: any) {
        console.log('Eror While Updating A Order:', error);
        return void res.status(500).json({error: error.message})
    }
}

const deleteOrder = async (req:Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const deletedOrder = await Order.findByIdAndDelete(id)
        if (!deletedOrder) {
            return void res.status(500).json({error: 'Error While Deleting Order'})
        }
        res.status(200).json(deletedOrder)
    } catch (error: any) {
        console.log('Eror While Deleting A Order:', error);
        return void res.status(500).json({error: error.message})
    }
}

export { getOrders, getOrder, createPayment, createOrder, updateOrder, deleteOrder}