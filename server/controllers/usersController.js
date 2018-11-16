import pool from '../db/config';
class UsersController {
    static getUserOrderHistory(req, res) {
        try {
            return res.status(200).json({
                status: 'success',
                message: `orders for user ${req.params.userId}`,
                count: req.customerOrders.length,
                orders: req.customerOrders
            });
        } catch (error) {
            return res.status(500).json({ status: 'error', message: 'internal server error' });
        }
    }// end getOneCustomerOrders 
}// end class UsersController

export default UsersController;