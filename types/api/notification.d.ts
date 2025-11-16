interface notification_count_unread extends common_response {
    data: {
        /** The number of notifications with unseen status*/
        count: number;
    }
}

interface notification_list_unread_response_item {
    /** id of user_notification */
    id: number;
    /** id of target of notification
     *
     * this should match the id of logged user
     */
    user_id: string;
    /* ranges from 0 - 1
     * 0 : unseen - notification is sent but is not noticed
     * 1 : seen - notfication is seen and noticed
     */
    status: number;
    notification_id: number;
    message: string;
    level: number;
    state:number;
    created_at: string;
}

interface notification_list_unread_response extends common_response {
    data: notification_list_unread_response_item[]
}

interface notification_list_all_response_item {
    /**
    * Id of notification, this can be shared by multiple users
    * so they can view same notification at the same time
    */
    id: number;
    /**
     * String of message attached to the notification to
     * be rendered in the user screen
     */
    message: string;
    /** ranks as the importance
     * 0 as highest
     * 3 as lowest
     */
    level: 0;
    created_at: string;
    /** 
     * the primary key of user_notification 
     * this should be used as primary key for
     * delete and update operations
    */
    user_notification_id: number;
}

interface notification_list_all_response extends common_response {
    data: {
        data: notification_list_all_response_item[],
        /**
         * The id of the last item in the list of sent notifications
         * this will be used as "end_from" field in further
         * api request to allow pagination
         */
        next_cursor: number;
    }
}
