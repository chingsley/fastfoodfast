import pool from '../db/config';

class MenuController {
    static async getMenu(req, res) {
        try {
            const menu = (await pool.query('SELECT * FROM menu')).rows;
            menu.forEach(item => {
                item.request = {
                    type: 'GET',
                    ulr: `http://localhost:3000/api/v1/menu/${item.id}`
                }
            });
            res.status(200).json({
                status: 'success',
                message: 'menu fetched successfully',
                count: menu.length,
                menu,

            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'see line 16 menuController.js'
            });
        }
    } // end static async getMenu

    static async getOneMenu(req, res) {
        try{
            // const selectQuery = 'SELECT * FROM menu WHERE id=$1';
            // const item = (await pool.query(selectQuery, [req.params.id])).rows[0];
            return res.status(200).json({
                menuItem: req.item,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/api/v1/menu"
                },
            });
        } catch(error) {
            return res.status(500).json({
                status: 'error',
                message: 'internal server error, try again'
            });
        }
    }// end getOneMenu

    static async addFood(req, res) {
        const { foodName, foodImage, price } = req;
        try {
            const insertQuery = 'INSERT INTO menu(food_name, food_image, price) VALUES($1, $2, $3) RETURNING *';
            const newFood = (await pool.query(insertQuery, [foodName, foodImage, price])).rows[0];

            res.status(201).json({
                status: 'success',
                message: 'new food added successfully',
                food: newFood,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/api/v1/menu/${newFood.id}`
                }
            });
        } catch(error) {
            res.status(500).json({
                status: 'error',
                message: 'see line 35 menuController.js'
            });
        }
    }// end static async addFood

    static async deleteFood(req, res) {
        try {
            const deleteQuery = `DELETE FROM menu WHERE id=$1`;
            pool.query(deleteQuery, [req.params.id]);
            res.status(200).json({
                status: 'success',
                message: 'food item successfully deleted',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/api/v1/menu'
                }
            });
        } catch(error) {
            return res.status(500).json({
                status: 'error',
                message: 'internal server error, try again'
            });
        }
    }
} // end class MenuController


export default MenuController;