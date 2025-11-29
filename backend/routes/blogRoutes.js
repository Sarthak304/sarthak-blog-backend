// routes/blogRoutes.Js
const express = require("express");
const {
    createBlog, getAllBlogs,
    getBlogById,
    updateBlog, deleteBlog
} = require('../controllers/blogController');

const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
// Public Routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
// Admin Protected Routes
router.post('/', authMiddleware, createBlog); 
router.put('/:id', authMiddleware, updateBlog); 
router.delete ('/:id', authMiddleware, deleteBlog);
module.exports = router;