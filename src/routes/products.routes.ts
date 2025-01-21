import {Router} from 'express'
import {body, param} from 'express-validator'

const router = Router();

import  {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    updateAvalability,
    createProduct,
} from '../controllers/product.controller'
import { handleInputErrors } from '../middleware';


router.get('/', getProducts)

router.get('/:id',
    param('id').isInt().withMessage('Id must be a number'),
    handleInputErrors,
    getProductById)

router.post('/',   //path
    body('name').notEmpty().withMessage('Product must have a name'), //validations
    body('price')
        .notEmpty().withMessage('Product must have a price')
        .isNumeric().withMessage('Product price must be a number')
        .custom(x => x > 0).withMessage('Product price must be a positive number'),
        handleInputErrors,  //middleware
        createProduct);     //controller

router.put('/:id', 
    param('id').isInt().withMessage('Id must be a number'),
    body('name').notEmpty().withMessage('Product must have a name'), //validations
    body('price')
        .notEmpty().withMessage('Product must have a price')
        .isNumeric().withMessage('Product price must be a number')
        .custom(x => x > 0).withMessage('Product price must be a positive number'),
    body('availability').isBoolean().withMessage('Product availability must be provided'),
    handleInputErrors,
    updateProduct
)

router.patch('/:id', 
    param('id').isInt().withMessage('Id must be a number'),
    handleInputErrors,
    updateAvalability
)

router.delete('/:id',
    param('id').isInt().withMessage('Id must be a number'),
    handleInputErrors,
    deleteProduct)

export default router;