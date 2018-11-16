import Validator from '../validators/validator';
import pool from '../db/config';

class Inspect {
    static signup(req, res, next) {
        const {name, email, password, confirmPassword, adminSecret} = req.body;

        const missingFields = [name, email, password, confirmPassword].map((field, index) => {
            const keys = {
                0: 'name',
                1: 'email',
                2: 'password',
                3: 'confirm password'
            };
            return field === undefined ? keys[index] : null;
        }).filter(field => field !== null).join(', ');

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: `you are missing the following fields: ${missingFields}`
            });
        }

        const response = message => res.status(400).json({status: 'error', message});

        if(!Validator.isValidName(name)) return response('invalid name');
        if(Validator.isEmail(email).error) return response(Validator.isEmail(email).message);
        if(!Validator.isMatchingPasswords(password, confirmPassword)) return response('the two passwords do not match');
        if(!Validator.isValidPassword(password)) return response('invalid password');

        req.name = name.trim();
        req.email = email.trim();
        req.password = password.trim();
        req.adminSecret = adminSecret;
        return next();
    } // end static signup

    static signin(req, res, next) {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'some required fields are missing'
            });
        }

        if (Validator.isEmail(email).error || !Validator.isValidPassword(password)) {
            return res.status(400).json({
                status: 'error',
                message: 'email or password not correctly formatted',
            });
        }

        req.email = email.trim();
        req.password = password.trim();
        return next();
    }// end static signin

    static async updateStatus(req, res, next) {
        const { status } = req.body;
        if(!status) return res.status(400).json({status: 'error', message: 'you are missing the status field'});
        
        if (
            status !== 'complete' && 
            status !== 'processing' &&
            status !== 'cancelled' &&
            status !== 'new'

        ) {
            return res.status(400).json({
                status: 'error',
                message: `Incorrect status type. Allowed values are 'new', 'complete', 'processing', or 'cancelled'`
            });
        }

        if(!Number.isInteger(Number(req.params.orderId))){
            return res.status(400).json({status: 'error', message: 'invalid order id'});
        }

        let queryString = `SELECT * FROM orders WHERE id=$1`;
        const order = (await pool.query(queryString, [req.params.orderId])).rows[0];
        if(!order) return res.status(404).json({status:'error', message: 'no order matches the specified id'});
        req.order = order;
        req.status = status;
        return next();
    } // end static updateStatus

    
    static async addFood(req, res, next) {
        const { foodName, price } = req.body;

        if (!foodName || !price) {
            return res.status(400).json({
                status: 'error',
                message: `you're missing some required fields`,
            });
        }

        if(!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'You must provide an image for the food item'
            });
        }

        const selectionQuery = 'SELECT * FROM menu WHERE food_name = $1';
        const foodAlreadyExists = (await pool.query(selectionQuery, [foodName])).rowCount;
        // console.log(foodAlreadyExists);
        if(foodAlreadyExists) {
            return res.status(400).json({
                status: 'error',
                message: `${foodName} already exists. You can't have duplicate food items`
            });
        }

        req.foodName = foodName;
        req.price = price;
        req.foodImage = req.file.path;
        return next();
    } // end static addFood

    static async getOneMenu(req, res, next) {
        if (!Number.isInteger(Number(req.params.id))) {
            return res.status(400).json({
                status: 'error',
                message: 'invalid id for a menu item',
            });
        }
        const selectQuery = 'SELECT * FROM menu WHERE id=$1';
        const item = (await pool.query(selectQuery, [req.params.id])).rows[0];
        console.log(item);
        if(!item) {
            return res.status(401).json({
                status: 'error',
                message: `Item with id ${req.params.id} does not exist`
            });
        }

        req.item = item;
        return next();
    } // end static async getOneMenu

    static async deleteFood(req, res, next) {
        if (!Number.isInteger(Number(req.params.id))) {
            return res.status(400).json({
                status: 'error',
                message: 'invalid id for a menu item',
            });
        }
        const selectQuery = 'SELECT * FROM menu WHERE id=$1';
        const item = (await pool.query(selectQuery, [req.params.id])).rows[0];
        console.log(item);
        if(!item) {
            return res.status(401).json({
                status: 'error',
                message: `Item with id ${req.params.id} does not exist`
            });
        }

        req.item = item;
        return next();
    } // end static async deleteFood

    static async newOrder(req, res, next) {
        const { foodIds } = req.body;

        if (!foodIds ||
            !Validator.isArray(foodIds) ||
            !foodIds.length ||
            !Validator.isArrayOfNumbers(foodIds)
        ) return res.status(400).json({ status: 'error', message:'foodIds should be an array of numbers' });

        const { allFoodExists, allFoodItems } = await Validator.isArrayOfValidFoodIds(foodIds);
        if (!allFoodExists) {
            return res.status(404).json({
                status: 'error',
                message: 'one of the requested food items does not exist',
                request: {
                    type: 'GET',
                    returns: 'all existing food items',
                    url: `http://localhost:${process.env.PORT}/api/v1/menu`
                }
            });
        }

        // create array of requested food names
        const foodItems = foodIds
            .map(foodId => allFoodItems.find(foodItem => foodItem.id === Number(foodId)).food_name);

        // Calculate total price of all requested food items
        const foodItemsTotalPrice = foodIds 
            .map(foodId => allFoodItems.find(foodItem => foodItem.id === Number(foodId)).price)
            .reduce((total, current) => total + current);

        req.foodItems = foodItems;
        req.foodItemsTotalPrice = foodItemsTotalPrice;
        return next();
    } // end static async newOrder

    static async getOrders(req, res, next) {
        const selectQuery = `SELECT * FROM orders WHERE owner_id=$1`;
        const selectAllQuery = `SELECT * FROM orders`;
        const allOrders = (await pool.query(selectAllQuery)).rows;
        const ordersForThisUser = (await pool.query(selectQuery, [req.userId])).rows;
        let orders = req.userStatus === 'admin' ? allOrders : ordersForThisUser;
        if(!orders) {
            return res.status(404).json({
                status: 'error',
                message: `no orders found`
            });
        }
        req.orders = orders;
        return next();
    }// end getOrders

    static async getOneOrder(req, res, next) {
        if(!Number.isInteger(Number(req.params.id))) {
            return res.status(400).json({
                status: 'error',
                message: 'invalid id for an order'
            });
        }

        const adminQueryString = `SELECT * FROM orders WHERE id=$1`;
        const customerQueryString = `SELECT * FROM orders WHERE id=$1 AND owner_id=$2`;
        const order = req.userStatus === 'admin' ? 
                (await pool.query(adminQueryString, [req.params.id])).rows[0] :
                (await pool.query(customerQueryString, [req.params.id, req.userId])).rows[0];
        if(!order) {
            return res.status(404).json({
                status: 'error',
                message: 'order not found'
            });
        }
        req.order = order;
        return next();
    }// end getOneOrder

    static async getUserOrderHistory(req, res, next){
        if(!Number.isInteger(Number(req.params.userId))) {
            return res.status(400).json({status: 'error', message: 'invalid user id'});
        }
        const fetchQuery = `SELECT * FROM orders WHERE owner_id = $1`;
        const customerOrders = (await pool.query(fetchQuery, [req.params.userId])).rows;
        if(customerOrders.length === 0) {
            return res.status(404).json({status: 'error', message:'no orders found for the specified user id'});
        }
        req.customerOrders = customerOrders;
        return next();
    }// end getOneCustomerOrders

} // end class Inspect 

export default Inspect;