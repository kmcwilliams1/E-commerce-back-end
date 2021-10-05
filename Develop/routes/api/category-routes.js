const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
    let categoryData = Category.findAll({
      include: [
        {
          model: Product,
          through: category_id
        }
      ]
    }
    )
    res.json(categoryData)
  } catch (err){res.json(err)}
  });

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    let categoryData = Category.findOne({
      include: [
        {
          model: Product,
          through: category_id
        }
      ]
    }
    )
    res.json(categoryData)
  } catch (err){res.json(err)}
  });

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body)
  .then((category) =>{
    if (req.body.categoryIds.length) {
      const newCategory = req.body.categoryIds.map((category_id) => {
        return {
          category_id: category_id
        };
      });
      return Category.create(newCategory)
    }
    res.status(200).json(category);
  })
  .then((categoryId) => res.status(200).json(categoryId))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id
    },
  })
  .then((category) =>{
    return Category.findAll ({
      where:{
        category_id: req.params.id
      }});
  })
  .then((categoryTag) => {
    // get list of current tag_ids
    const categoryId = categoryTag.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newCategoryTag = req.body.tagIds
      .filter((tag_id) => !categoryId.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    // figure out which ones to remove
    const categoryTagToRemove = categoryTag
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // run both actions
    return Promise.all([
      CategoryTag.destroy({ where: { id: categoryTagToRemove } }),
      CategoryTag.bulkCreate(newCategoryTag),
    ]);
  })
  .then((updatedCategoryTags) => res.json(updatedCategoryTags))
  .catch((err) => {
    // console.log(err);
    res.status(400).json(err);
  });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  try{
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      },
    })
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
