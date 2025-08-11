const express = require('express');
const router = express.Router();
const Query = require('../models/query');

// Create a new query (Contact Us form submission)

const createNewQuery = async (req, res) => {
  try {
    console.log('Creating new query:', req.body);
    const { fullName, phoneNumber, email, address, subject, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, message: 'Full name, email and message are required' });
    }

    const newQuery = new Query({ fullName, email, phoneNumber, address, subject, message });
    await newQuery.save();

    res.status(201).json({ success: true, message: 'Query submitted successfully' });
  } catch (error) {
    console.error('Error creating query:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all queries (for admin)

const getAllQueries = async (req, res) => {
  try {
    console.log('Fetching all queries');
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json({ success: true, queries: queries });
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update status of a query (admin)
const updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(`Updating query status for ID ${req.params.id} to ${status}`);
    if (!['Pending', 'In Process', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const query = await Query.findById(req.params.id);
    console.log('Found query:', query);
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found' });
    }

    query.status = status;
    await query.save();

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createNewQuery,
  getAllQueries,
  updateQueryStatus
};
