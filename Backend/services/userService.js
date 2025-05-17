const Agent = require("../models/agentModel");
const bcrypt = require('bcrypt');

//checks email is valid or not
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
//checks mobile number is valid or not
function isValidPhoneNumber(phone) {
    const phoneRegex = /^\+[1-9]\d{1,2}\d{6,14}$/;
    return phoneRegex.test(phone);
  }
exports.addAgentService = async ({ email, password, name, phone }) => {
  if (!email || !password || !name || !phone) {
    throw new Error("All fields must be filled.");
  }
  if (!isValidEmail(email)) {
    throw new Error("Invalid email address");
  }
  //checks if this email already exists or not
  const existingAgent = await Agent.findOne({ email });
  if (existingAgent) {
    const error = new Error("Agent with this Email Already Exists.");
    error.statusCode = 404;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error("Password must be greater than 6 characters");
    error.message = "Password must be greater than 6 characters";
    error.statusCode = 404;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const agent = new Agent({
    email,
    password: hashedPassword,
    name:name,
    phone:phone
  });
  await agent.save();

  return { agent };
};

exports.getAgentsService = async () => {
  const agents = await Agent.find();
  return { agents }
};

const XLSX = require('xlsx');
const Task = require('../models/taskModel');

exports.distributeTasks = async (fileBuffer) => {
  try {
    // Parse the uploaded file
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Validate CSV format
    const requiredFields = ['FirstName', 'Phone', 'Notes'];
    if (sheet.length === 0) {
      throw Object.assign(new Error('File is empty'), { status: 400 });
    }
    const firstRow = sheet[0];
    const missingFields = requiredFields.filter(field => !Object.keys(firstRow).includes(field));
    if (missingFields.length > 0) {
      throw Object.assign(new Error(`Missing required fields: ${missingFields.join(', ')}`), { status: 400 });
    }

    // Validate phone numbers and convert to number type
    for (const row of sheet) {
      const phone = row.Phone;
      if (typeof phone !== 'string' && typeof phone !== 'number') {
        throw Object.assign(new Error('Phone must be a string or number'), { status: 400 });
      }
      
      const phoneNumber = Number(phone);
      if (isNaN(phoneNumber)) {
        throw Object.assign(new Error(`Invalid phone number: ${phone}`), { status: 400 });
      }
      row.Phone = phoneNumber; 
    }

    const agents = await Agent.find();
    if (agents.length === 0) {
      throw Object.assign(new Error('No agents available to assign tasks'), { status: 400 });
    }

    // Clear previous tasks
    await Task.deleteMany();

    // Distribute tasks
    const tasksPerAgent = Math.floor(sheet.length / agents.length);
    const remainder = sheet.length % agents.length;
    let taskIndex = 0;

    for (let i = 0; i < agents.length; i++) {
      const agentTasks = [];
      const tasksToAssign = tasksPerAgent + (i < remainder ? 1 : 0);

      for (let j = 0; j < tasksToAssign; j++) {
        if (taskIndex < sheet.length) {
          const taskData = sheet[taskIndex];
          const task = new Task({
            firstName: taskData.FirstName,
            phone: taskData.Phone,
            notes: taskData.Notes,
            agentId: agents[i]._id,
          });
          agentTasks.push(task);
          taskIndex++;
        }
      }
      await Task.insertMany(agentTasks);
    }
  } catch (error) {
    throw error; // Let the controller handle the response
  }
};

exports.getDistributedTasks = async () => {
  try {
    const tasks = await Task.find().populate('agentId', 'name');
    return tasks;
  } catch (error) {
    throw error;
  }
};
