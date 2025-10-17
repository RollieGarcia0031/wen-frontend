interface common_response {
    success: boolean,
    message: string,
    data: any
}

interface auth_login_request {
    email: string,
    password: string
}

interface auth_login_response extends common_response{
    data: {
        id: number,
        name: string,
        email: string
    }
}

interface auth_register_request {
    name: string,
    email: string,
    password: string,
    role: UserRole
}

interface auth_profile_response {
    id: number,
    name: string,
    email: string,
    role: UserRole
}