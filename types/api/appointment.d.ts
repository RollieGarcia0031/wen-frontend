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
  message: string;
  target_date: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  name: string;
}

interface appointment_list_response extends common_response {
  data: appointment_list_response_item[];
}


interface appointment_count_response_item {
  status: string;
  count: number;
}

interface appointment_count_response extends common_response {
  data?: appointment_count_response_item[];
}
