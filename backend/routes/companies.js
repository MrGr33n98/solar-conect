const express = require('express');
const { Company, User, Category, sequelize } = require('../models'); // Make sure to require sequelize for Op
const { Op } = require('sequelize'); // Import Op
const passport = require('passport');
const upload = require('../middleware/uploadMiddleware'); // Added upload middleware
const multer = require('multer'); // Required for MulterError instance check

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

// POST /api/companies - Create a new company
router.post('/', requireAuth, async (req, res) => {
  const { name, description, contactEmail, website, categoryIds } = req.body; // Added categoryIds
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
    if (categoryIds && company.setCategories) { // If categoryIds are provided, set them
      await company.setCategories(categoryIds);
    }
    // To include categories in the response, you might need to reload the company instance
    const companyWithCategories = await Company.findByPk(company.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Category, as: 'categories', through: { attributes: [] } } // through: {attributes: []} to exclude join table fields
      ]
    });
    res.status(201).json(companyWithCategories);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: 'Validation Error', errors: error.errors.map(e => e.message) });
    }
    res.status(500).json({ message: 'Error creating company' });
  }
});

// GET /api/companies - Get all companies (public, with search and pagination)
router.get('/', async (req, res) => {
  try {
    const { name, categoryId, city, state, page, limit } = req.query;
    let whereClause = {};
    let includeClause = [
      { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      { model: Category, as: 'categories', through: { attributes: [] } } // Include categories
    ];

    if (name) {
      whereClause.name = { [Op.iLike]: `%${name}%` }; // Case-insensitive partial match
    }
    if (city) {
      whereClause.city = { [Op.iLike]: `%${city}%` };
    }
    if (state) {
      whereClause.state = { [Op.iLike]: `%${state}%` };
    }

    if (categoryId) {
      const categoryInclude = includeClause.find(inc => inc.model === Category);
      if (categoryInclude) {
        categoryInclude.where = { id: categoryId };
      } else { // Should not happen if Category is always in includeClause by default
        includeClause.push({ model: Category, as: 'categories', where: { id: categoryId }, through: { attributes: [] }});
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const { count, rows } = await Company.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: limitNum,
      offset: offset,
      distinct: true,
      order: [['name', 'ASC']]
    });

    res.json({
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      totalCompanies: count,
      companies: rows
    });

  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
});

// GET /api/companies/:id - Get a single company by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Category, as: 'categories', through: { attributes: [] } } // Include categories
      ]
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
  const {
    name, description, contactEmail, website, categoryIds,
    city, state, addressLine1, addressLine2, postalCode,
    logoUrl, bannerUrl, valueIndicator, strengths,
    warrantyDetails, servicesOffered, brandsWorkedWith
  } = req.body;
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    // Authorization: Check if authenticated user owns the company or is an admin
    if (company.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You do not own this company or are not an admin.' });
    }

    // Update standard fields
    company.name = name !== undefined ? name : company.name;
    company.description = description !== undefined ? description : company.description;
    company.contactEmail = contactEmail !== undefined ? contactEmail : company.contactEmail;
    company.website = website !== undefined ? website : company.website;

    // Update new fields
    company.city = city !== undefined ? city : company.city;
    company.state = state !== undefined ? state : company.state;
    company.addressLine1 = addressLine1 !== undefined ? addressLine1 : company.addressLine1;
    company.addressLine2 = addressLine2 !== undefined ? addressLine2 : company.addressLine2;
    company.postalCode = postalCode !== undefined ? postalCode : company.postalCode;
    company.logoUrl = logoUrl !== undefined ? logoUrl : company.logoUrl;
    company.bannerUrl = bannerUrl !== undefined ? bannerUrl : company.bannerUrl;
    company.valueIndicator = valueIndicator !== undefined ? valueIndicator : company.valueIndicator;
    company.strengths = strengths !== undefined ? strengths : company.strengths;
    company.warrantyDetails = warrantyDetails !== undefined ? warrantyDetails : company.warrantyDetails;
    company.servicesOffered = servicesOffered !== undefined ? servicesOffered : company.servicesOffered;
    company.brandsWorkedWith = brandsWorkedWith !== undefined ? brandsWorkedWith : company.brandsWorkedWith;

    await company.save();

    if (categoryIds && Array.isArray(categoryIds) && company.setCategories) { // If categoryIds are provided, update them
      await company.setCategories(categoryIds.map(id => Number(id))); // Ensure IDs are numbers if coming from JSON
    }
    // To include categories in the response, you might need to reload the company instance
    const companyWithCategories = await Company.findByPk(company.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
        { model: Category, as: 'categories', through: { attributes: [] } }
      ]
    });
    res.json(companyWithCategories);
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

// POST /api/companies/:id/logo - Upload/update company logo
router.post('/:id/logo', requireAuth, async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    if (company.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You do not own this company or are not an admin.' });
    }

    // Use multer middleware for single file upload named 'logo'
    const logoUpload = upload.single('logo'); // 'logo' is the field name in the form-data

    logoUpload(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: 'Multer error uploading file.', error: err.message });
        }
        return res.status(400).json({ message: 'File upload error.', error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No logo file uploaded.' });
      }

      // Construct the URL path
      const logoUrlPath = `/public/uploads/images/${req.file.filename}`;
      company.logoUrl = logoUrlPath;
      await company.save();
      // Refetch company to include all details, including new logoUrl and categories
      const updatedCompany = await Company.findByPk(company.id, {
        include: [
            { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
            { model: Category, as: 'categories', through: { attributes: [] } }
        ]
      });
      res.json({ message: 'Logo uploaded successfully', company: updatedCompany });
    });

  } catch (error) {
    console.error('Error during logo upload process:', error);
    res.status(500).json({ message: 'Server error during logo upload.' });
  }
});

// POST /api/companies/:id/banner - Upload/update company banner
router.post('/:id/banner', requireAuth, async (req, res) => {
    try {
        const company = await Company.findByPk(req.params.id);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        if (company.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden.' });
        }

        const bannerUpload = upload.single('banner');
        bannerUpload(req, res, async (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ message: 'Multer error uploading file.', error: err.message });
                }
                return res.status(400).json({ message: 'File upload error.', error: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ message: 'No banner file uploaded.' });
            }
            const bannerUrlPath = `/public/uploads/images/${req.file.filename}`;
            company.bannerUrl = bannerUrlPath;
            await company.save();
            // Refetch company to include all details
            const updatedCompany = await Company.findByPk(company.id, {
                include: [
                    { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
                    { model: Category, as: 'categories', through: { attributes: [] } }
                ]
            });
            res.json({ message: 'Banner uploaded successfully', company: updatedCompany });
        });
    } catch (error) {
        console.error('Error during banner upload process:', error);
        res.status(500).json({ message: 'Server error during banner upload.' });
    }
});

module.exports = router;
