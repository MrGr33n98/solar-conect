const express = require('express');
const { Company, User } = require('../models'); // Adjust path as necessary
const passport = require('passport');

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

// POST /api/companies - Create a new company
router.post('/', requireAuth, async (req, res) => {
  const { name, description, contactEmail, website } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Company name is required.' });
  }
  try {
    const company = await Company.create({
      name,
      description,
      contactEmail,
      website,
      userId: req.user.id // Associate with the authenticated user
    });
    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error creating company' });
  }
});

// GET /api/companies - Get all companies (public)
router.get('/', async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }] // Include owner info
    });
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching companies' });
  }
});

// GET /api/companies/:id - Get a single company by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
    });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching company' });
  }
});

// PUT /api/companies/:id - Update a company
router.put('/:id', requireAuth, async (req, res) => {
  const { name, description, contactEmail, website } = req.body;
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    // Authorization: Check if authenticated user owns the company or is an admin
    if (company.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You do not own this company or are not an admin.' });
    }
    company.name = name || company.name;
    company.description = description || company.description;
    company.contactEmail = contactEmail || company.contactEmail;
    company.website = website || company.website;
    await company.save();
    res.json(company);
  } catch (error) {
    console.error(error);
     if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error updating company' });
  }
});

// DELETE /api/companies/:id - Delete a company
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    if (company.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You do not own this company or are not an admin.' });
    }
    await company.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting company' });
  }
});

module.exports = router;
