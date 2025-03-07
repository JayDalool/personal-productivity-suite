import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createEvent, listEvents, updateEvent, deleteEvent } from './calendar.service';
import { getAuthUrl, setAccessToken } from './googleCalendar.service';

// Define types for query, params, body (per route)
interface AuthCallbackQuery {
    code: string;
}

interface EventParams {
    id: string;
}

interface EventBody {
    title: string;
    startDate: string;
    endDate: string;
    description?: string;
}

export default async function calendarRoutes(fastify: FastifyInstance) {
    fastify.get('/auth', async (request, reply) => {
        return { url: getAuthUrl() };
    });

    fastify.get('/calendar/auth/callback', async (request: FastifyRequest<{ Querystring: AuthCallbackQuery }>, reply: FastifyReply) => {
        const { code } = request.query;
        await setAccessToken(code);
        reply.send({ message: 'Authorization complete. Token saved.' });
    });

    fastify.get('/calendar/events', async () => {
        return await listEvents();
    });

    fastify.post('/calendar/events', async (request: FastifyRequest<{ Body: EventBody }>, reply: FastifyReply) => {
        const event = await createEvent(request.body);
        reply.send(event);
    });

    fastify.put('/calendar/events/:id', async (request: FastifyRequest<{ Params: EventParams; Body: EventBody }>, reply: FastifyReply) => {
        const { id } = request.params;
        const event = await updateEvent(id, request.body);
        reply.send(event);
    });

    fastify.delete('/calendar/events/:id', async (request: FastifyRequest<{ Params: EventParams }>, reply: FastifyReply) => {
        const { id } = request.params;
        await deleteEvent(id);
        reply.send({ message: 'Event deleted' });
    });
}
