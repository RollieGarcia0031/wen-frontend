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