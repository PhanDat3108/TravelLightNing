const { number } = require('joi');
const mongoose = require('mongoose');
slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const schema = new mongoose.Schema({
    name: String,
    parent: String,
    position: Number,
    status: String,
    avatar: String,
    description: String,
    createdBy: String,
    slug: {
        type: String,
        slug: "name",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: String,
    deletaAt: Date

}, {
    timestamps: true
});
const Category = mongoose.model('Category', schema, 'categories')
module.exports = Category;