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
