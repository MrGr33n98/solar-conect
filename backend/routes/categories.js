const express = require('express');
const { Category, Company } = require('../models'); // Assuming models/index.js exports all models
const passport = require('passport');
const { isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

// Helper function to generate slug (if not using model hook consistently or for updates)
const generateSlug = (name) => {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

// POST /api/categories (Admin only)
router.post('/', requireAuth, isAdmin, async (req, res) => {
  const { name, description } = req.body;
  let { slug } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }
  if (!slug) {
    slug = generateSlug(name);
  } else {
    slug = generateSlug(slug); // Ensure provided slug is also formatted
  }

  try {
    const newCategory = await Category.create({ name, slug, description });
    res.status(201).json(newCategory);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Validation Error or Slug/Name already exists', errors: error.errors.map(e => e.message) });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
});

// GET /api/categories (Public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      // Optionally include companies associated with each category
      // include: [{ model: Company, as: 'companies', attributes: ['id', 'name'] }]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// GET /api/categories/:slug (Public) - Fetch by slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug },
      // include: [{ model: Company, as: 'companies' }]
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Error fetching category' });
  }
});


// PUT /api/categories/:slug (Admin only) - Update by slug
router.put('/:slug', requireAuth, isAdmin, async (req, res) => {
  const { name, description } = req.body;
  let { slug: newSlug } = req.body; // newSlug from body, if provided
  const currentSlug = req.params.slug;

  if (name && !newSlug) { // If name changes and no new slug, regenerate slug from new name
    newSlug = generateSlug(name);
  } else if (newSlug) {
    newSlug = generateSlug(newSlug); // Format provided new slug
  }

  try {
    const category = await Category.findOne({ where: { slug: currentSlug } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name || category.name;
    category.description = description === undefined ? category.description : description; // Allow setting description to null/empty
    if (newSlug && newSlug !== category.slug) { // If slug is changing
        category.slug = newSlug;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Validation Error or Slug/Name already exists', errors: error.errors.map(e => e.message) });
    }
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
});

// DELETE /api/categories/:slug (Admin only) - Delete by slug
router.delete('/:slug', requireAuth, isAdmin, async (req, res) => {
  try {
    const category = await Category.findOne({ where: { slug: req.params.slug } });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
});

module.exports = router;
