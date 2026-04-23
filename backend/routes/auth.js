const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// Helper: generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// ─── POST /api/register ───────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, course } = req.body;

    if (!name || !email || !password || !course) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check for duplicate email
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      return res.status(409).json({ message: 'Email already registered. Please login.' });
    }

    const student = await Student.create({ name, email, password, course });

    const token = generateToken(student._id);

    res.status(201).json({
      message: 'Registration successful!',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        course: student.course
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── POST /api/login ──────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(student._id);

    res.json({
      message: 'Login successful!',
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        course: student.course
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── GET /api/me (protected) ──────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({
    student: {
      id: req.student._id,
      name: req.student.name,
      email: req.student.email,
      course: req.student.course,
      createdAt: req.student.createdAt
    }
  });
});

// ─── PUT /api/update-password (protected) ─────────────────────────────────────
router.put('/update-password', protect, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    // Fetch student with password field
    const student = await Student.findById(req.student._id);
    const isMatch = await student.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect.' });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: 'New password must be different from old password.' });
    }

    student.password = newPassword;
    await student.save(); // pre-save hook will hash it

    res.json({ message: 'Password updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── PUT /api/update-course (protected) ──────────────────────────────────────
router.put('/update-course', protect, async (req, res) => {
  try {
    const { course } = req.body;

    if (!course || course.trim() === '') {
      return res.status(400).json({ message: 'Course name is required.' });
    }

    const student = await Student.findByIdAndUpdate(
      req.student._id,
      { course: course.trim() },
      { new: true, select: '-password' }
    );

    res.json({
      message: 'Course updated successfully!',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        course: student.course
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
