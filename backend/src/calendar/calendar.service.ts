import { google } from 'googleapis';
import { getOAuthClient } from './googleCalendar.service';

const calendar = google.calendar({ version: 'v3', auth: getOAuthClient() });

export async function createEvent(eventData: any) {
    const event = {
        summary: eventData.title,
        description: eventData.description,
        start: { dateTime: eventData.start_time, timeZone: 'UTC' },
        end: { dateTime: eventData.end_time, timeZone: 'UTC' },
    };

    const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
    });

    return res.data;
}

export async function listEvents() {
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });

    return res.data.items || [];
}

export async function updateEvent(eventId: string, eventData: any) {
    const event = {
        summary: eventData.title,
        description: eventData.description,
        start: { dateTime: eventData.start_time, timeZone: 'UTC' },
        end: { dateTime: eventData.end_time, timeZone: 'UTC' },
    };

    const res = await calendar.events.update({
        calendarId: 'primary',
        eventId,
        requestBody: event,
    });

    return res.data;
}

export async function deleteEvent(eventId: string) {
    await calendar.events.delete({
        calendarId: 'primary',
        eventId,
    });
}
