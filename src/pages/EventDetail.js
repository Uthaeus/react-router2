import { Suspense } from "react";
import { Link, json, useRouteLoaderData, redirect, defer, Await } from "react-router-dom";

import EventItem from '../components/EventItem';
import EventsList from "../components/EventsList";

const EventDetailPage = () => {
    const {event, events} = useRouteLoaderData('event-detail');

    return (
        <>
            <Suspense fallback={<p style={{textAlign: 'center'}}>Loading...</p>}>
                <Await resolve={event}>
                    {loadedEvent => <EventItem event={loadedEvent} />}
                </Await>
            </Suspense>
            <Suspense fallback={<p style={{textAlign: 'center'}}>Loading...</p>}>
                <Await resolve={events}>
                    {loadedEvents => <EventsList events={loadedEvents} />}
                </Await>
            </Suspense>
            
            <p><Link to='..' relative="path">Back</Link></p>
        </>
    );
};


export default EventDetailPage;

const loadEvent = async (id) => {
    const response = await fetch('http://localhost:8080/events');

    if (!response.ok) {
        return json({message: 'Could not fetch events'}, {status: 500});
    } else {
        const resData = await response.json();
        console.log('loadEvent, eventDetail', resData.events[0]);
        return resData.events[0];
    }
}

const loadEvents = async () => {
    const response = await fetch('http://localhost:8080/events');

    if (!response.ok) {
        //return { isError: true, message: 'Could not fetch events'}
        // throw new Response(JSON.stringify({message: 'Could not fetch events'}), {status: 500});
        return json({message: 'Could not fetch events'}, {status: 500});
    } else {
        const resData = await response.json();
        return resData.events;
    }
}

export const loader = async ({request, params}) => {
    const id = params.eventId;

    return defer({
        event: await loadEvent(id),
        events: loadEvents()
    });
}


export const action = async ({params, request}) => {
    const id = params.eventId;

    const response = await fetch('http://localhost:8080/events/' + id, {
        method: request.method,
    });

    if (!response.ok) {
        throw json({message: 'Could not delete selected event.'}, {status: 500})
    }

    return redirect('/events');
}