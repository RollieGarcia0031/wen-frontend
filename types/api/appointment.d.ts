interface search_professor_user_availability {
  end_time: string;
  start_time: string;
  day_of_week: number;
  availability_id: number;
}

interface search_professor_user_response_item {
  name: string;
  email: string;
  id: string;
  availabilities: search_professor_user_availability[];
  classes: {
    course: string;
    description: string;
    year: number;
  }[];
}

interface search_professor_user_response extends common_response {
  data: search_professor_user_response_item[];
}

interface appointment_list_response_item {
  id: number;
  status: number;
  header: string;
  target_date: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  counterpart_name: string;
}

interface appointment_list_response extends common_response {
  data: {
    /**
     * The actual list of appointments
     */
    items: appointment_list_response_item[];
    /**
     * The cursor for the next page, useful for pagination
     * to access the remaining data
     */
    next_cursor: {
      cursor_id: number;
      cursor_date: string;
    }
  }
}

type TimeRange = 'today' | 'tomorrow' | 'this_week';

interface appointment_count_response_item {
  status: number;
  count: number;
}

interface appointment_count_response extends common_response {
  data?: appointment_count_response_item[];
}

interface appointment_currentDay_response_item {
  id: string;
  message: string;
  status: number;
  start_time: string;
  end_time: string;
  name: string;
}

interface appointment_currentDay_response extends common_response {
  data: {
    data: appointment_currentDay_response_item[],
    next_cursor_id: number,
    next_cursor_time: string
  }
}