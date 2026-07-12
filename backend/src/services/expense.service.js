const prisma = require("../lib/prisma");

async function createExpense(data) {
  return prisma.expense.create({
    data: {
      ...data,
      date: new Date(data.date),
    },
  });
}

async function getAllExpenses() {
  return prisma.expense.findMany({
    include: {
      vehicle: true,
    },
    orderBy: {
      date: "desc",
    },
  });
}

async function getExpenseById(id) {
  return prisma.expense.findUnique({
    where: {
      id: Number(id),
    },
  });
}

async function updateExpense(id, data) {
  return prisma.expense.update({
    where: {
      id: Number(id),
    },
    data: {
      ...data,
      ...(data.date && {
        date: new Date(data.date),
      }),
    },
  });
}

async function deleteExpense(id) {
  return prisma.expense.delete({
    where: {
      id: Number(id),
    },
  });
}

module.exports = {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};