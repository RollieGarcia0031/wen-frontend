import fetchBackend from "@/lib/fetchBackend";

/**
 * Fetches the appointments from the database,
 * with pagination
 */
export default function fetchAppointments(
    cursor_id: number,
    cursor_date: string,
    filter?: {
        status?: number,
        time_range?: string
    }
) {

    const body:any = {
        cursor_id,
        cursor_date
    };

    if (filter) {
        body.status = filter.status;
        body.time_range = filter.time_range;
    }

    return fetchBackend("appointment/list", {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(body)
    });
    
}