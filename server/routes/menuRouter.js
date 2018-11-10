import { Router } from 'express';
import AuthHandler from '../middleware/authHandler';
import MenuController from '../controllers/menuController';
import Inspect from '../middleware/inspector';
import multer from 'multer';

const router = new Router();


const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './uploads');
    },
    filename(req, file, callback) {
        callback(null, file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true); // accept the file
    } else {
        callback(null, false); // reject the file: don't save the file, but do not throw an error
    }
};

const upload = multer({
    storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter
});


router.get('/', MenuController.getMenu);
router.post('/', AuthHandler.authorize, AuthHandler.authorizeAdmin, upload.single('foodImage'), Inspect.addFood, MenuController.addFood,);
router.get('/:id', Inspect.getOneMenu, MenuController.getOneMenu);
router.delete('/:id', AuthHandler.authorize, AuthHandler.authorizeAdmin, Inspect.deleteFood, MenuController.deleteFood);

export default router;