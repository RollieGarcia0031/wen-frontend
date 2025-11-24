interface department_list_all_response_item {
    id: number;
    name: string;
    code: string;
}

interface department_list_all_response extends common_response {
    data: department_list_all_response_item[]
}

interface department_list_joined_response extends common_response {
    data: department_list_all_response_item[]
}