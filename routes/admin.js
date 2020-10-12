const path = require('path');

const express = require('express');

const isAuth = require('../middleware/isAuth')
const { check, body } = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', check('title', 'Please enter proper input')
    .isEmpty()
    .isAlphanumeric()
    .trim(),
    body('price')
    .isFloat()
    .isEmpty()
    .trim(),
    check('description')
    .isEmpty()
    .isAlphanumeric()
    .trim()
    , isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
