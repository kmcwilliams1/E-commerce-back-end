// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category,{
  foreignKey: ummmm
})
// Categories have many Products
Category.hadMany(Product{
  foreignKey: uhhhhhh
})

// Products belongToMany Tags (through ProductTag) what does
// through ProductTag mean?
Product.belongToMany(Tag{
  foreignKey: ehhhhh
})

// Tags belongToMany Products (through ProductTag)
Tag belongToMany(Product{
  foreignKey: emmmmmmm
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
