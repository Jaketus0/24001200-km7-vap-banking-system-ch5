const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
let {JWT_SECRET_KEY}   = process.env;

class AuthControllers {

    static async handleRegister(req, res) {
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
                    data: {
                        name,
                        email,
                        password: encryptedPassword,
                        profiles: {identityType, identityNumber, address}
                    }
                });
            }
        } catch (error) {
            return res.status(500).json({ error: "Terjadi kesalahan saat registrasi" });
        }
    }

    static async handleLogin(req, res, next) {
        try {
            let{email, password} = req.body;
            let user = await prisma.user.findUnique({
                where: {email}
            })
            if(!user){ 
                return res.status(400).json({
                    message: "Bad Request",
                    status: false,
                    error: "invalid email or password",
                    data: null
                });
            }
            let isPasswordCorrect = await bcrypt.compare(password, user.password);
            if(!isPasswordCorrect){
                return res.status(400).json({
                    message: "Bad Request",
                    status: false,
                    error: "invalid email or password",
                    data: null
                });
            }
            let token = jwt.sign(user, JWT_SECRET_KEY); 
            return res.status(200).json({
                status: true,
                message: "Created", 
                error: null,
                data: {user,token}
            })
        } catch (error) {
            next(error);
        }
    }

    static async handleAuthenticate(req, res, next) {
        return res.status(200).json({
            message: "OK",
            status: true,
            error: null,
            data: req.user 
        })
    }
}

module.exports = AuthControllers;
