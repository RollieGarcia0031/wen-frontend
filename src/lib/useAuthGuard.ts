import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * A custom hook to guard routes, redirecting unauthenticated users to the login page.
 * It also handles a loading state while authentication status is being determined.
 *
 * @param allowedRoles - An optional array of roles. If provided, the user must have one of these roles to access the page.
 *                       If the user is logged in but does not have an allowed role, they will be redirected to the home page.
 */
export function useAuthGuard(allowedRoles?: string[]) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                // User is not logged in, redirect to login page
                router.replace('/login');
            } else if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                // User is logged in but does not have an allowed role, redirect to home
                // Assuming `user.role` exists and is a string. Adjust if User type is different.
                router.replace('/'); // Redirect to home or an unauthorized page
            }
        }
    }, [user, isLoading, router, allowedRoles]);

    return { user, isLoading };
}
