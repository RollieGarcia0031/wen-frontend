interface info_update_professor_request {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  birthday?: string;
  gender? :number;
  bio?: string;
  cellphone_number?: string;
}

interface info_update_professor_response_item {
  first_name: string;
}

interface info_update_professor_response extends common_response {
  data: info_update_professor_response_item;
}

interface info_professor_response_item {
  user_id: string,
  first_name: string,
  last_name: string,
  middle_name: string,
  birthday: string,
  bio: string,
  gender: number,
  cellphone_number: string,
  user_name: string,
  email: string,
  department_name: string,
  department_code: string,
  sections: [
    year_level: number,
    section_code: string,
    course_code: string,
    course_name: string
  ]
}

interface info_professor_response extends common_response {
  data: info_professor_response_item;
}