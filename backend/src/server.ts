import fastify from 'fastify';
import fastifyPostgres from '@fastify/postgres';
import dotenv from 'dotenv';
import calendarRoutes from './calendar/calendar.controller';

dotenv.config();

const app = fastify();

app.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/personal_suite',
});

// REGISTER CALENDAR ROUTES
app.register(calendarRoutes, { prefix: '/calendar' });

app.get('/', async (request, reply) => {
    return { message: 'Welcome to Personal Productivity Suite!' };
});

app.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
