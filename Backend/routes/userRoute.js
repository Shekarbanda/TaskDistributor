const express = require("express");
const router = express.Router();
const {
  addAgentController, getAgentsController, getDistributedTasks, uploadAndDistribute
} = require("../controllers/userController");

router.post("/add-agent" ,addAgentController);
router.get("/get-agents", getAgentsController);
router.post('/upload', uploadAndDistribute);
router.get('/get-tasks', getDistributedTasks);

module.exports = router;
