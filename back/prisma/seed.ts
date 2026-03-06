import { PrismaClient } from '../generated/prisma/client';
import dotenv from 'dotenv';
dotenv.config();
import { faker } from '@faker-js/faker';


const prisma = new PrismaClient();

async function main() {
    for (let i = 0; i < 15; i++) {
    await prisma.payments.create({
      data: {
          member_id: faker.number.int({ min: 1, max: 10 }),
          amount: faker.number.int({min: 1, max: 100}),
          paid_at: faker.date.between({ from: '2000-01-01', to: Date.now() })
      }
    });
  }
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
