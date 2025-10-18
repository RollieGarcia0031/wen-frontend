interface course_create_response extends common_response {
    data: {
        /** Id of the inserted/created data in the database */
        id: number;
    }
}