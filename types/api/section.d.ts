interface section_item {
    section_id: number;
    year_level: number;
    section_code: string;
}

interface section_list_all_response_item {
    course_name: string;
    course_code: string;
    sections: section_item[];
}

interface section_list_all_response extends common_response {
    data: section_list_all_response_item[]
}

interface section_list_owned_response extends common_response {
    data: section_list_all_response_item[]
}