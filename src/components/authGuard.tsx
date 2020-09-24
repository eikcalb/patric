import { useContext } from "react";
import { APP_AUTH_CONTEXT } from "../lib";
import { User } from "../lib/user";

/**
 * Authentication guard to prevent access to views if the authentication fails.
 * The props provided are:
 *      onAuthFailed - This is called when authentication fails.
 *      onAuthSuccess (optional) - If provided, this will be executed immediately after auth check
 * @param props 
 */
export default function AuthGuard({ onAuthFailed, onAuthSuccess, children }: { children: any, onAuthFailed: () => any, onAuthSuccess?: (user: User) => any }) {
    const authCTX = useContext(APP_AUTH_CONTEXT)

    if (authCTX.signedIn) {
        if (onAuthSuccess) onAuthSuccess(authCTX.signedIn as User)
        return children
    } else {
        return onAuthFailed()
    }
}