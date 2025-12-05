import { SearchFilter } from "@/context/AppointmentContext";
import fetchBackend from "@/lib/fetchBackend";

/**
 * Fetches the appointments from the database,
 * with pagination
 */
export default function fetchAppointments(
    cursor_id: number,
    cursor_date: string,
    filter?: SearchFilter
) {

    const body:any = {
        cursor_id,
        cursor_date
    }; console.log(body);

    if (filter?.status || filter?.status === 0) body.status = filter.status;
    body.time_range = filter?.time_range || "all";

    return fetchBackend("appointment/list", {
        method: "POST",
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(body)
    });
    
}