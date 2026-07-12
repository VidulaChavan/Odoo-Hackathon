const expenseService = require("../services/expense.service");
const { expenseSchema } = require("../schemas/expense.schema");

async function createExpense(req, res) {
  try {
    const data = expenseSchema.parse(req.body);

    const expense = await expenseService.createExpense(data);

    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}

async function getAllExpenses(req, res) {
  try {
    const expenses = await expenseService.getAllExpenses();

    res.json(expenses);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function getExpenseById(req, res) {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function updateExpense(req, res) {
  try {
    const expense = await expenseService.updateExpense(
      req.params.id,
      req.body
    );

    res.json(expense);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}

async function deleteExpense(req, res) {
  try {
    await expenseService.deleteExpense(req.params.id);

    res.json({
      message: "Expense deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};