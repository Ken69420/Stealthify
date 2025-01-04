const express = require("express");
const router = express.Router();
const DataModel = require("../models/anonymizedEmployee");

router.get("/stats", async (req, res) => {
  try {
    const totalEntries = await DataModel.countDocuments();
    const uniqueDepartment = await DataModel.distinct("department");
    const result = await DataModel.aggregate([
      { $match: { jobSatisfaction: { $ne: null } } }, // Ensure jobSatisfaction is not null
      {
        $group: {
          _id: null,
          avgJobSatisfaction: { $avg: "$jobSatisfaction" }, // Calculate average of jobSatisfaction
        },
      },
    ]);

    const avgSatisfaction = result[0]?.avgJobSatisfaction || 0;

    res.json({
      totalEntries,
      totalDepartments: uniqueDepartment.length,
      avgSatisfaction,
    });
  } catch (error) {
    console.error("Error fetching stats:", error.message);
    res.status(500).json({ error: "failed to fetch stats" });
  }
});

module.exports = router;
