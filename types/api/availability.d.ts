interface availability_list_response_item {
    id: numbers;
    day_of_week: number;
    start_time: string;
    end_time: string;
    /**
     * The number of appointments that are related to the availability
     *
     * The only counted appointments in this field are ones with status
     * that are currently pending or approved, and has a tartget_date
     * assigned to future dates (past and present not included)
     */
    booked: number;
}

/**
 * Returns the availability along with how many appointments
 * are related to it
 */
interface availability_list_response extends common_response {
    data: availability_list_response_item[];
}
