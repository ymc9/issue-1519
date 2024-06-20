import { PrismaClient } from '@prisma/client';
import { enhance } from '@zenstackhq/runtime';

const prisma = new PrismaClient();

// A `main` function so that we can use async/await
async function main() {
    await prisma.usuario.deleteMany();
    await prisma.aluno.deleteMany();

    await prisma.usuario.create({ data: { id: '1', nome: 'User1' } });
    for (let i = 0; i < 5; i++) {
        await prisma.aluno.create({
            data: { nome: 'Aluno' + i, usuarioId: '1' },
        });
    }

    const teste = await prisma.aluno.findMany({
        take: 3,
        where: {
            usuarioId: '1',
        },
    });

    console.log('teste', teste);

    const prismaEnhanced = enhance(
        prisma,
        { user: { id: '1' } },
        { logPrismaQuery: true }
    );

    const teste2 = await prismaEnhanced.aluno.findMany({
        take: 3,
    });

    console.log('teste2', teste2);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
