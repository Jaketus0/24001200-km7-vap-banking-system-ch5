const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUser = async (req, res) => {
    // try {
    //     const newUser = req.body;
    //     const newProfile = req.body;
    //     const user = await prisma.user.create({ data: newUser });
    //     const profile = await prisma.profile.create({ data: newProfile });
    //     res.status(200).json({
    //         message: 'Dump Data',
    //         data: user, profile
    //     });
        
    // } catch (error) {
    //     res.status(400).send("Create user failed");
    // }
    try {
        const { name, email, password, identityType, identityNumber, address } = req.body;
        
        const cekEmailUnik = await prisma.user.findUnique({
            where: { email }
        });

        if (cekEmailUnik) {
            return res.status(400).json({
                error: "Email sudah terdaftar. Silakan gunakan email lain.",
                message: "Bad Response",
                status: false
            });
        } else {
            const encryptedPassword = bcrypt.hashSync(password, 10);

            const userData = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: encryptedPassword,
                    profiles: {create: {identityType, identityNumber, address}}
                }
            });
            
            return res.status(201).json({
                message: "Berhasil ditambahkan",
                data: userData
            });
        }
    } catch (error) {
        return res.status(500).json({ error: "Terjadi kesalahan saat registrasi" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.send(users);
    } catch (error) {
        res.status(400).send("Get users failed");
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        user ? res.send(user) : res.status(400).send("User not found");
    } catch (error) {
        res.send("Get user failed");
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
        });
        res.send({ message: "Update user success", data: user });
    } catch (error) {
        res.status(400).send("Update user failed");
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.send("Delete user success");
    } catch (error) {
        res.send("Delete user failed");
    }
};
