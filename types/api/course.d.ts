interface course_create_response extends common_response {
    data: {
        /** Id of the inserted/created data in the database */
        id: number;
    }
}

interface courseListItem {
    id: number;
    created_by: string;
    name: string;
    description: string;
}

interface course_list_response extends common_response {
    data: courseListItem[]
}

interface SelfCourseItem {
  id: number;
  name: string;
  description: string;
}

interface course_list_self_response extends common_response {
    data: SelfCourseItem[]
}

interface course_use_response extends common_response {
    data: {
        new_id: number;
    }
}

interface course_assigned_item {
    id: number;
    year: number;
    name: string;
    description: string;
}

interface course_assigned_response extends common_response {
    data: course_assigned_item[];
}