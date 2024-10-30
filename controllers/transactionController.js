const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mendapatkan semua transaksi
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve transactions" });
    }
};

// Membuat transaksi baru
exports.createTransaction = async (req, res) => {
    try {
        const { sourceAccountId, destinationAccountId, amount } = req.body;
        const transaction = await prisma.transaction.create({
            data: { sourceAccountId, destinationAccountId, amount }
        });
        res.status(201).json({ message: "Transaction created successfully", data: transaction });
    } catch (error) {
        res.status(400).json({ message: "Transaction creation failed" });
    }
};

// Mendapatkan transaksi berdasarkan ID
exports.getTransactionById = async (req, res) => {
    try {
        const transactionId = parseInt(req.params.id);
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId }
        });
        transaction ? res.json(transaction) : res.status(404).json({ message: "Transaction not found" });
    } catch (error) {
        res.status(400).json({ message: "Failed to retrieve transaction" });
    }
};

// Menghapus transaksi berdasarkan ID
exports.deleteTransaction = async (req, res) => {
    try {
        const transactionId = parseInt(req.params.id);
        await prisma.transaction.delete({
            where: { id: transactionId }
        });
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete transaction" });
    }
};
