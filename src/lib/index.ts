import { createContext } from "react";
import { DEFAULT_CONFIG, IConfig } from "./config";
import { User } from "./user";
import * as SecureStorage from 'expo-secure-store'
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import Auth from "./auth";


/**
 * Application contains the main logic of this software.
 * Within this class are core functions to aid in performing tasks.
 */
export class Application {
    protected config

    name = 'Patric'
    version = '1.0'
    description = 'Test application for Patricia mobile developer role'

    user?: User

    constructor(config: IConfig) {
        this.config = config
    }

    /**
     * Fetches the user session previously saved in the application.
     */
    async inflateSession() {
        let raw = await SecureStorage.getItemAsync('app.usersession')
        if (!raw) throw new Error("No session available for user!")
        let session = JSON.parse(raw)
        if (!session) throw new Error("No session available for user!")

        this.user = new User(session)
        return this.user
    }

    /**
     * Saves the user session to be retrieved at a later time.
     */
    protected async persistUserSession() {
        if (!this.user) {
            throw new Error("No user created!")
        }
        return await SecureStorage.setItemAsync('app.usersession', JSON.stringify(this.user))
    }

    /**
     * Deletes the saved user session
     */
    async deleteUserSession() {
        return await SecureStorage.deleteItemAsync('app.usersession')
    }



    /**
     * Opens image picker for user to select an image
     */
    async getMediaPicture() {
        let res = await launchImageLibraryAsync({
            allowsEditing: true,
            mediaTypes: MediaTypeOptions.Images,
            base64: true
        })

        if (res.cancelled) {
            throw new Error("Media selection cancelled!")
        }
        console.log(res)
        return { uri: res.uri, type: res.type, height: res.height, width: res.width }
    }

    /**
     * TODO: implement saving photo logic
     * 
     * Saves photo provided
     */
    async uploadProfilePicture({ uri, type }) {
        const form: any = new FormData()
        const uriSplit = uri.split("/")
        form.append('data', {
            uri,
            type,
            name: uriSplit[uriSplit.length - 1]
        })

        return false
    }

    /**
     * Authenticates the user to access application
     * @param email 
     * @param password 
     */
    async loginUser(email, password): Promise<User> {
        const response = await new Auth(this).login(email, password)
        this.user = new User(response)
        await this.persistUserSession()

        // Return user object 
        return this.user
    }

    /**
     * Registers a new user to application
     * @param data 
     */
    async registerUser(data: { email, firstName, lastName, password }): Promise<User> {
        const response = await new Auth(this).register(data)
        this.user = new User(response)
        await this.persistUserSession()

        // Return the new user object
        return this.user
    }

    /**
     * Exposes logic for deleting user data from application. Intended user's email and password must be specified.
     * 
     * @param email 
     * @param password 
     */
    async deleteUser(email,password):Promise<boolean>{
        return new Auth(this).deleteUser(email,password)
    }
}

export const DEFAULT_APPLICATION = new Application(DEFAULT_CONFIG)

// This context is used within the application, to provide common functionality globally.
export const APPLICATION_CONTEXT = createContext(DEFAULT_APPLICATION)

/** 
 * This context is used to allow authentication state to be available for components.
 * 
 * Generally, updating the global application context`APPLICATION_CONTEXT` object value will not update views.
 * This is because the object reference does not change when a property changes and building a new object.
 * 
 * When a user is signed in, the value will contain the user object, otherwise, it will be false.
 * An additional function is provided to update this value from any nested component.
*/
export const APP_AUTH_CONTEXT = createContext<{
    setSignedInState: (param) => any,
    signedIn: boolean | User
}>({ signedIn: false, setSignedInState: () => { } })