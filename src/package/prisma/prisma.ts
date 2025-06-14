import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 15000,
    timeout: 15000
  },
})