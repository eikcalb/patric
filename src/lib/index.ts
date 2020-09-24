import { createContext } from "react";
import { DEFAULT_CONFIG, IConfig } from "./config";
import { User } from "./user";

/**
 * Application contains the main logic of this software.
 * Within this class are core functions to aid in performing tasks.
 */
export class Application {
    protected config

    name = 'Patric'
    version = '1.0'
    description = 'Test application for Patricia mobile developer role'

    constructor(config: IConfig) {
        this.config = config
    }
}
export const DEFAULT_APPLICATION = new Application(DEFAULT_CONFIG)

// This context is used within the application, to provide common functionality globally.
export const APPLICATION_CONTEXT = createContext(DEFAULT_APPLICATION)

/** 
 * This context is used to allow authentication state to be available for components.
 * 
 * Generally, updating the global application context`APPLICATION_CONTEXT` object value will not update views.
 * This is because the object reference does not change when a property changes and building a new object 
*/
export const APP_AUTH_CONTEXT = createContext<{
    setSignedInState: (param) => any,
    signedIn: boolean | User
}>({ signedIn: false, setSignedInState: () => { } })