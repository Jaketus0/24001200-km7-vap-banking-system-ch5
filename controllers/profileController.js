const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mendapatkan semua profil
exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await prisma.profile.findMany();
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve profiles" });
    }
};

// Membuat profil baru
exports.createProfile = async (req, res) => {
    try {
        const { userId, address, identityType, identityNumber } = req.body;
        const profile = await prisma.profile.create({
            data: { userId, address, identityType, identityNumber }
        });
        res.status(201).json({ message: "Profile created successfully", data: profile });
    } catch (error) {
        res.status(400).json({ message: "Profile creation failed" });
    }
};

// Mendapatkan profil berdasarkan ID
exports.getProfileById = async (req, res) => {
    try {
        const profileId = parseInt(req.params.id);
        const profile = await prisma.profile.findUnique({
            where: { id: profileId }
        });
        profile ? res.json(profile) : res.status(404).json({ message: "Profile not found" });
    } catch (error) {
        res.status(400).json({ message: "Failed to retrieve profile" });
    }
};

// Memperbarui profil berdasarkan ID
exports.updateProfile = async (req, res) => {
    try {
        const profileId = parseInt(req.params.id);
        const { address, identityType, identityNumber } = req.body;
        const profile = await prisma.profile.update({
            where: { id: profileId },
            data: { address, identityType, identityNumber }
        });
        res.json({ message: "Profile updated successfully", data: profile });
    } catch (error) {
        res.status(400).json({ message: "Failed to update profile" });
    }
};

// Menghapus profil berdasarkan ID
exports.deleteProfile = async (req, res) => {
    try {
        const profileId = parseInt(req.params.id);
        await prisma.profile.delete({
            where: { id: profileId }
        });
        res.json({ message: "Profile deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete profile" });
    }
};

