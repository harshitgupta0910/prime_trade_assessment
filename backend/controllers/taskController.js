const Task = require("../models/Task");

const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.create({ title, description, status, createdBy: req.user._id });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const tasks = await Task.find(filter).populate("createdBy", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate("createdBy", "name email");
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    if (req.user.role !== "admin" && task.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden." });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    if (req.user.role !== "admin" && task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this task." });
    }
    const allowedFields = ["title", "description", "status"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }
    await task.deleteOne();
    res.status(200).json({ success: true, message: "Task deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
