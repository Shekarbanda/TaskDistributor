const {
  addAgentService,
  getAgentsService,
  getDistributedTasks,
  distributeTasks,
} = require("../services/userService");
const { errorResponse, successResponse } = require("../utils/responseUtils");
const multer = require("multer");

exports.addAgentController = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const result = await addAgentService({ email, password, name, phone });
    res.status(200).json(successResponse(result, "Agent added successfully"));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(error.message || "Internal server error"));
  }
};

exports.getAgentsController = async (req, res) => {
  try {
    const result = await getAgentsService();
    res
      .status(200)
      .json(successResponse(result, "Agents fetched successfully"));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(error.message || "Internal server error"));
  }
};

// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only CSV, XLSX, and XLS files are allowed"));
    }
    cb(null, true);
  },
}).single("file");

// Upload and Distribute Tasks
exports.uploadAndDistribute = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    // Check if file is present
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const result = await distributeTasks(req.file.buffer);
      res
        .status(200)
        .json(successResponse(result, "Agents fetched successfully"));
    } catch (error) {
      res
        .status(500)
        .json(errorResponse(error.message || "Internal server error"));
    }
  });
};

// Get all tasks
exports.getDistributedTasks = async (req, res) => {
  try {
    const result = await getDistributedTasks();
    res
      .status(200)
      .json(successResponse(result, "Agents fetched successfully"));
  } catch (error) {
    res
      .status(500)
      .json(errorResponse(error.message || "Internal server error"));
  }
};
