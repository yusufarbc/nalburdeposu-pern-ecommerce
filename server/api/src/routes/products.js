import express from 'express';
import { productController } from '../container.js';

const router = express.Router();

// Ürün Listeleme
router.get('/', productController.getProducts);

// Ürün Detay
router.get('/:id', productController.getProduct);

// Ürün Detay (Slug ile)
router.get('/slug/:slug', productController.getProductBySlug);

export default router;
