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
            const objectRaw = await SecureStorage.getItemAsync(`protected.${username}`)
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
        const { email} = data
        try {
            await this.validateRegister(data)

            const objectRaw = await SecureStorage.getItemAsync(`protected.${email}`)
            if (objectRaw) {
                throw new Error('User already exists!')
            }
            const user = JSON.stringify(data)
            await SecureStorage.setItemAsync(`protected.${email}`, user)

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
            if (email && password && firstName && lastName && country && dateOfBirth && role) {
                if (!validator.isEmail(email)) return rej(new Error("Invalid email!"))
                if (!validator.matches(password, new RegExp('^[a-zA-Z0-9]{6,30}$'))) return rej(new Error("Password format not accepted!"))
                // if (!validator.equals(password, passwordVerify)) return rej(new Error("Password must match!"))
                if (!validator.matches(dateOfBirth, /^\d{4}-\d{1,2}-\d{1,2}$/)) return rej(new Error("Provide a valid date of birth!"))
                if (!validator.matches(role, /player|manager/)) return rej(new Error("Provide a valid role"))
            } else {
                return rej(new Error("Required fields have been omitted!"))
            }

            res(true)
        })
    }
}