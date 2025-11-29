const express = require('express');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer Setup for File Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// GET /employees - Get all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /employees/search - Search by Department or Position
router.get('/employees/search', async (req, res) => {
    try {
        const { department, position } = req.query;
        let query = {};
        if (department) query.department = { $regex: department, $options: 'i' };
        if (position) query.position = { $regex: position, $options: 'i' };
        
        const employees = await Employee.find(query);
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /employees/:id - Get employee by ID
router.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /employees - Create new employee (with image)
// Using 'image' as the key for file
router.post('/employees', auth, upload.single('image'), async (req, res) => {
    try {
        const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;
        
        const newEmployee = new Employee({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department,
            profile_pic: req.file ? `/uploads/${req.file.filename}` : null
        });

        const savedEmployee = await newEmployee.save();
        res.status(201).json({ message: 'Employee created successfully', employee_id: savedEmployee._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /employees/:id - Update employee
router.put('/employees/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const updates = req.body;
        if(req.file) {
            updates.profile_pic = `/uploads/${req.file.filename}`;
        }
        
        updates.updated_at = Date.now();

        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
        
        res.status(200).json({ message: 'Employee updated successfully', updatedEmployee });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /employees/:id - Delete employee
router.delete('/employees/:id', auth, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        
        res.status(204).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;