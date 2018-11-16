import pool from '../db/config';
import emailChecker from './emailChecker';

class Validator {
    static isEmail(email) {
        // const re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/ig;
        // return re.test(email.trim().toLowerCase());
        return emailChecker.verifyEmail(email);
    }

    static isValidPassword(password) {
        return password.trim().length > 5;
    }

    static isMatchingPasswords(password, confirmPassword) {
        return password.trim() === confirmPassword.trim();
    }

    static isValidName(name) {
        return name.trim().length >= 2;
    }

    static isArray(value) {
        return Array.isArray(value);
    }

    static isArrayOfNumbers(array) {
        return array.every(element => !Number.isNaN(Number(element)));
    }

    static async isArrayOfValidFoodIds(foodIds) {
        try {
            const allFoodItems = (await pool.query('SELECT * FROM menu')).rows;
            const validFoodIds = allFoodItems.map(food => food.id);
            return {
                allFoodExists: foodIds.every(foodId => validFoodIds.includes(Number(foodId))),
                allFoodItems,
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}// end class Validator

export default Validator;