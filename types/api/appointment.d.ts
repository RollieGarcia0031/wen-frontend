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
