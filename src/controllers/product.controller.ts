import {Request, Response} from 'express'
import Product from '../models/Product.model'

const getProducts = async (req: Request, res: Response): Promise<void> => {
    const products = await Product.findAll({
        order: [
            ['id', 'DESC']
        ],
        attributes: {exclude: ['avalability', 'createdAt', 'updatedAt']}
    })
    res.status(200).json({data: products})
}

const getProductById = async (req: Request, res: Response): Promise<void> => {
    const {id: productId} = req.params;
    const product = await Product.findByPk(productId)
    if(!product) {
        res.status(404).json({error: 'Product not found'});
        return 
    }

    res.status(200).json({data: product})
}

const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.create(req.body)   
        res.status(201).json({data: product})        
    } catch (error) {
        console.log(error)
    }
}

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const {id: productId} = req.params;
    const product = await Product.findByPk(productId);
    if(!product) {
        res.status(404).json({error: 'Product not found'});
        return;
    }
    await product.destroy();
    res.status(200).json({data: 'Product removed'})
}

const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const {id: productId} = req.params;
    const product = await Product.findByPk(productId)
    if(!product) {
       res.status(404).json({error: 'Product not found'});
       return;
    }

    await product.update(req.body)
    await product.save();
    res.status(200).json({data: product });
}

const updateAvalability = async (req: Request, res: Response): Promise<void> => {
    const {id: productId} = req.params;
    const product = await Product.findByPk(productId)
    if(!product) {
       res.status(404).json({error: 'Product not found'});
       return;
    }

    product.availability = !product.dataValues.availability;
    await product.save();
    res.status(200).json({data: product });   
}

export {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
    updateAvalability
}
