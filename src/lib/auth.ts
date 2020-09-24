import * as SecureStorage from "expo-secure-store";
import validator from 'validator';
import { Application } from ".";
import { User } from "./user";

export default class Auth {
    app: Application

    constructor(app: Application) {
        this.app = app
    }


    /**
     * Logic for authenticating user.
     * @param username 
     * @param password 
     */
    async login(username, password) {
        try {
            await this.validateLogin({ email: username, password })

            // because the username contains '@' which is not allowed as a key  name, replace '@' with '_'
            const key = `protected.${username.replace('@', '_')}`
            const objectRaw = await SecureStorage.getItemAsync(key)
            if (!objectRaw) {
                throw new Error('User not found!')
            }
            const user = JSON.parse(objectRaw)

            if (user.password !== password) {
                throw new Error("Password is incorrect")
            }

            return new User(user)
        } catch (e) {
            throw e
        }
    }

    /**
     * Validates the user's credential.
     * 
     * @param {email,password}
     */
    protected validateLogin({ email, password }) {
        return new Promise((res, rej) => {
            if (email && password) {
                // validate email
                if (!validator.isEmail(email)) return rej(new Error("Invalid email!"))
                if (!validator.matches(password, new RegExp('^[a-zA-Z0-9]{6,30}$'))) return rej(new Error("Password format is incorrect!"))
            } else {
                return rej(new Error("Email and password must be provided"))
            }
            res(true)
        })
    }

    /**
     * Logic for registering user into application
     * 
     * @param data 
     */
    async register(data) {
        const { email } = data
        try {
            await this.validateRegister(data)

            // because the username contains '@' which is not allowed as a key  name, replace '@' with '_'
            const key = `protected.${email.replace('@', '_')}`
            const objectRaw = await SecureStorage.getItemAsync(key)
            if (objectRaw) {
                throw new Error('User already exists!')
            }
            const user = JSON.stringify(data)
            await SecureStorage.setItemAsync(key, user)

            return new User(data)
        } catch (e) {
            throw e
        }
    }

    /**
     * Validates user data upon registration
     * 
     * @param { email, password, firstName, lastName, country, dateOfBirth, role } 
     */
    protected validateRegister({ email, password, firstName, lastName, country, dateOfBirth, role }) {
        return new Promise((res, rej) => {
            if (email && password && firstName && lastName) {
                if (!validator.isEmail(email)) {
                    return rej(new Error("Invalid email!"))
                }
                if (!validator.matches(password, new RegExp('^[a-zA-Z0-9]{6,30}$'))) {
                    return rej(new Error("Password format not accepted!"))
                }
            } else {
                return rej(new Error("Required fields have been omitted!"))
            }

            res(true)
        })
    }

    /**
     * Logic to delete a user account from application. 
     * 
     * The user must provide a password before attempting to delete the specified account
     * 
     * @param email 
     * @param password 
     */
    async deleteUser(email, password) {
        try {
            // because the username contains '@' which is not allowed as a key  name, replace '@' with '_'
            const key = `protected.${email.replace('@', '_')}`
            const objectRaw = await SecureStorage.getItemAsync(key)
            if (!objectRaw) {
                throw new Error('User not found!')
            }

            if (JSON.parse(objectRaw).password !== password) {
                throw new Error('Password is incorrect')
            }
            await SecureStorage.deleteItemAsync(key)
            return true
        } catch (e) {
            throw e
        }
    }

}