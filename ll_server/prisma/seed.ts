import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import pino from 'pino';

const BATCH_SIZE = 100;

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  formatters: {
    level(label: string) {
      return { level: label.toUpperCase() };
    },
  },
  base: { pid: process.pid },
});

let prisma: PrismaClient;

const seed = async (len: number) => {
  logger.info('Seeding database...');

  try {
    prisma = new PrismaClient({
      log: ['query'],
    });

    const ideas = Array.from({ length: len }).map(() => ({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
    }));

    for (let i = 0; i < ideas.length; i += BATCH_SIZE) {
      const batch = ideas.slice(i, i + BATCH_SIZE);

      await prisma.idea.createMany({ data: batch });

      logger.info(
        `Seeded ${Math.min(i + BATCH_SIZE, ideas.length)} / ${ideas.length} ideas`,
      );
    }

    logger.info('Seeding completed successfully');
  } catch (error: unknown) {
    logger.error({ error }, 'Error seeding database');
    await prisma?.$disconnect();
    process.exit(1);
  } finally {
    await prisma?.$disconnect();
  }
};

void seed(5000);
