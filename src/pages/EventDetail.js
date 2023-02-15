import { Link, json, useRouteLoaderData, redirect } from "react-router-dom";

import EventItem from '../components/EventItem';

const EventDetailPage = () => {
    const data = useRouteLoaderData('event-detail');

    return (
        <>
            <EventItem event={data.event} />
            <p><Link to='..' relative="path">Back</Link></p>
        </>
    );
};



export default EventDetailPage;

export const loader = async ({request, params}) => {
    const id = params.eventId;

    const response = await fetch('http://localhost:8080/events/' + id);

    if (!response.ok) {
        throw json({message: 'Could not fetch details for selected event.'}, {status: 500})
    } else {
        return response;
    }
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