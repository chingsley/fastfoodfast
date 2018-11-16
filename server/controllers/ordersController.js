import pool from '../db/config';
import moment from 'moment';

class OrdersController {
    static async newOrder (req, res) {
        try {
            const insertQuery = `INSERT INTO orders(items, price, status, owner_id, created_date, modified_date)
                                    VALUES($1, $2, $3, $4, $5, $6) returning *`;
            const newOrder  = await pool.query(insertQuery, [
                req.foodItems.join(', '),
                req.foodItemsTotalPrice,
                'processing',
                req.userId,
                moment(new Date()),
                moment(new Date())
            ]);
            return res.status(201).json({
                status: 'success',
                message: 'new order was successfully placed',
                newOrder: newOrder.rows[0],
                request: {
                    type: 'GET',
                    returns: 'all the orders made by this user',
                    url: `http://localhost:${process.env.PORT}/api/v1/orders`
                }
            });
        } catch(error) {
            return res.status(500).json({
                status: 'error',
                message: 'ordersController.js, newOrder'
            });
        }
    } // end newOrder

    static async getOrders(req, res) {
        try {
            const user = req.userStatus === 'admin'? 'all users' : `user ${req.userId}`;
            return res.status(200).json({
                status: 'success',
                message: `orders made by ${user}`,
                count: req.orders.length,
                orders: req.orders
            });
        } catch(error) {
            return res.status(500).json({
                status: 'error',
                message: 'internal server error'
            });
        }
    }// end getOrders

    static getOneOrder(req, res) {
        try {
            return res.status(200).json({
                status: 'success',
                order: req.order,
                request: {
                    type: 'GET',
                    returns: 'all orders',
                    url: `http://localhost:${process.env.PORT}/api/v1/orders`
                }
            });
        } catch(error) {
            return res.status(500).json({
                status: 'error',
                message: 'internal server error'
            })
        }
    }// end getOneOrder

    static async updateStatus(req, res) {
        const queryString = `UPDATE orders SET status=$1 WHERE id=$2 returning *`;
        try {
            const updatedOrder = (await pool.query(queryString, [req.status, req.params.orderId])).rows;
            return res.status(200).json({
                status: 'success',
                message: 'order updated successfully',
                'updated order': updatedOrder
            });
        
        } catch(error) {
            console.log(error);
            return res.status(500).json({status: 'error', message: 'internal server error'});
        }
    }// end updateOrder
   
}// end class OrdersController

export default OrdersController;