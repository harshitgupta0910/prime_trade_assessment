const express = require("express");
const { body } = require("express-validator");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const verifyToken = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");

const router = express.Router();

router.use(verifyToken);

const createTaskRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Status must be 'pending' or 'completed'"),
];

const updateTaskRules = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Status must be 'pending' or 'completed'"),
];

router.post("/", createTaskRules, validate, createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTaskRules, validate, updateTask);
router.delete("/:id", authorize("admin"), deleteTask);

module.exports = router;
