import express from "express";
import crypto from "crypto"; // 👈 IMPORT NECESSÁRIO
import { readDB, writeDB } from "../utils/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/* -------------------------------------------
   GET ALL TASKS (user-specific)
-------------------------------------------- */
router.get("/", authMiddleware, (req, res) => {
  const db = readDB();

  // Garantir que db.tasks existe
  if (!db.tasks) db.tasks = [];

  const tasks = db.tasks.filter(t => t.userId === req.user.id);
  res.json(tasks);
});

/* -------------------------------------------
   CREATE TASK
-------------------------------------------- */
router.post("/", authMiddleware, (req, res) => {
  const db = readDB();

  if (!db.tasks) db.tasks = [];

  const newTask = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    title: req.body.title,
    category: req.body.category,
    mentalLoad: req.body.mentalLoad,
    energy: req.body.energy,
    dueDate: req.body.dueDate,
    status: "Pending" // 👈 estado inicial
  };

  db.tasks.push(newTask);
  writeDB(db);

  res.json(newTask);
});

/* -------------------------------------------
   UPDATE TASK
-------------------------------------------- */
router.put("/:id", authMiddleware, (req, res) => {
  const db = readDB();

  if (!db.tasks) db.tasks = [];

  const task = db.tasks.find(
    t => t.id === req.params.id && t.userId === req.user.id
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Atualiza apenas os campos enviados
  Object.assign(task, req.body);

  writeDB(db);
  res.json(task);
});

/* -------------------------------------------
   DELETE TASK
-------------------------------------------- */
router.delete("/:id", authMiddleware, (req, res) => {
  const db = readDB();

  if (!db.tasks) db.tasks = [];

  const before = db.tasks.length;

  db.tasks = db.tasks.filter(
    t => !(t.id === req.params.id && t.userId === req.user.id)
  );

  if (db.tasks.length === before) {
    return res.status(404).json({ message: "Task not found" });
  }

  writeDB(db);
  res.json({ success: true });
});

export default router;
