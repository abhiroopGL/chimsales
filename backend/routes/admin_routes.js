const express = require('express');
const router = express.Router();
const { getAllUsers } = require("../controllers/admin_controller");


// Get dashboard stats
// router.get("/stats", async (req, res) => {
//     try {
//         // In production, these would be actual database queries
//         const stats = {
//             totalUsers: 156,
//             totalProducts: 24,
//             totalOrders: 89,
//             totalRevenue: 12450.5,
//         }
//
//         res.json({
//             success: true,
//             stats,
//         })
//     } catch (error) {
//         console.error("Get stats error:", error)
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch stats",
//         })
//     }
// })

// Get all users (admin only)
router.get('/users', getAllUsers);

// Get all orders (admin only)
// router.get("/orders", async (req, res) => {
//     try {
//         // Mock orders data
//         const orders = [
//             {
//                 _id: "1",
//                 orderNumber: "ORD-001",
//                 customer: { fullName: "Ahmed Al-Rashid", phoneNumber: "+96550001234" },
//                 total: 450,
//                 status: "pending",
//                 createdAt: "2024-01-25T09:00:00Z",
//             },
//         ]
//
//         res.json({
//             success: true,
//             orders,
//         })
//     } catch (error) {
//         console.error("Get orders error:", error)
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch orders",
//         })
//     }
// })

// Get all queries (admin only)
// router.get("/queries", admin, async (req, res) => {
//     try {
//         // Mock queries data
//         const queries = [
//             {
//                 _id: "1",
//                 fullName: "Mohammed Al-Qattan",
//                 phoneNumber: "+96550009999",
//                 subject: "Product Inquiry",
//                 message: "I need information about chimney installation.",
//                 status: "pending",
//                 createdAt: "2024-01-26T11:00:00Z",
//             },
//         ]
//
//         res.json({
//             success: true,
//             queries,
//         })
//     } catch (error) {
//         console.error("Get queries error:", error)
//         res.status(500).json({
//             success: false,
//             message: "Failed to fetch queries",
//         })
//     }
// })

module.exports = router;
