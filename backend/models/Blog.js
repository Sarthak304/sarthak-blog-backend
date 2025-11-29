// models/Blog.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug : {
        type: String,
       required: true,
       unique: true
    },
    content: {
        type: String,
        required: true,
    },
    metaDescription : {
        type: String,
        default: "",
    },
     category : {
        type: String,
        enum : ['Apex','LWC','SOQL','Flow','CMDT','Scenario','Other'],
        required: true,
    },
    tags : {
      type : [String],
      default : []
    },
    demoUrl: {
        type: String, // YouTube embed link
        default: null,
    },
    createdBy: {
        type: String,
        default: "Sarthak"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);