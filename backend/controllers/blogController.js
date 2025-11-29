// controllers/blogController.js
const Blog = require('../models/Blog');

// Create Blog (Admin Only)
exports.createBlog = async (req, res) => {
    try {
        const { title, content, demoUrl,category,tags } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ message: 'Title and content required' });
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

        const metaDescription = content.substring(0,160);

        const newBlog = await Blog.create({
            title,
            slug,
            content,
            category,
            tags,
            metaDescription,
            demoUrl: demoUrl || null,
            createdBy: req.admin.username
        });

        res.json({
            message: 'Blog created successfully',
            blog: newBlog
        });

    } catch (error) {
        console.error('Create Blog Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Blogs (Public)
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error('Fetch Blogs Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Single Blog (Public)
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        res.json(blog);
    } catch (error) {
        console.error('Fetch Blog Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Blog (Admin Only)
exports.updateBlog = async (req, res) => {
    try {
        const { title, content, demoUrl } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, content, demoUrl },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({
            message: 'Blog updated successfully',
            blog: updatedBlog
        });
    } catch (error) {
        console.error('Update Blog Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Blog (Admin Only)
exports.deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Delete Blog Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};