const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await prisma.bank_accounts.findMany();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve accounts" });
    }
};

exports.createAccount = async (req, res) => {
    try {
        const { userId, bankName, bankAccountNumber, balance } = req.body;
        const account = await prisma.bank_accounts.create({
            data: { userId, bankName, bankAccountNumber, balance }
        });
        res.status(201).json({ message: "Account created successfully", data: account });
    } catch (error) {
        res.status(400).json({ message: "Account creation failed" });
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const accountId = parseInt(req.params.id);
        const account = await prisma.bank_accounts.findUnique({
            where: { id: accountId }
        });
        account ? res.json(account) : res.status(404).json({ message: "Account not found" });
    } catch (error) {
        res.status(400).json({ message: "Failed to retrieve account" });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const accountId = parseInt(req.params.id);
        const { bankName, bankAccountNumber, balance } = req.body;
        const account = await prisma.bank_accounts.update({
            where: { id: accountId },
            data: { bankName, bankAccountNumber, balance }
        });
        res.json({ message: "Account updated successfully", data: account });
    } catch (error) {
        res.status(400).json({ message: "Failed to update account" });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const accountId = parseInt(req.params.id);
        await prisma.bank_accounts.delete({
            where: { id: accountId }
        });
        res.json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete account" });
    }
};
