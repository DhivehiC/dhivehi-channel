const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const load = async () => {
    try {
        const records = [
            {
                first_name: "Hassan",
                last_name: "Iyan",
                user_name: "Iyan",
                email: "hassan.iyan.l@gmail.com",
                role: "admins"
            },
            {
                first_name: "Yaamin",
                last_name: "Rasheed",
                user_name: "Yaamin",
                email: "yaaminrasheed@gmail.com",
                role: "admins"
            }
        ]
        const res = await Promise?.all(records?.map(async(inputs)=>{
            const password = await bcrypt.hash(`${inputs.first_name}@dhivehichannel`, 10)
            return await prisma.users.upsert({
                create: {
                    first_name: inputs.first_name,
                    last_name: inputs.last_name,
                    user_name: inputs.user_name,
                    email: inputs.email,
                    role: inputs.role,
                    password: password,
                },
                update: {
                    first_name: inputs.first_name,
                    last_name: inputs.last_name,
                    user_name: inputs.user_name,
                    email: inputs.email,
                    role: inputs.role,
                    password: password,
                },
                where: {
                    email: inputs.email,
                }
            })
        }))
        console.table(res)
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect();
    }
};

load();