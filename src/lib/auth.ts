import { Application, auth } from "."
import validator from 'validator'
import * as SecureStorage from "expo-secure-store";
import * as Facebook from "expo-facebook";
import { User } from "./user";
import { CONSTANTS } from "./storage";

export default class Auth {
    app: Application

    constructor(app: Application) {
        this.app = app
    }

    static async saveRefreshToken(token) {
        return SecureStorage.setItemAsync(CONSTANTS.refreshToken, token)
    }

    async login(username, password) {
        try {
            await this.validateLogin({ email: username, password })
          const objectRaw = await SecureStorage.getItemAsync(`protected.${username}`)
            if(!objectRaw){
                
            }
            const jsonResponse = await response.json()
            await auth.signInWithCustomToken(jsonResponse.firebaseToken).catch(function (error) {
                let errorCode = error.code;
                if (errorCode === 'auth/invalid-custom-token') {
                    console.log('The token you provided is not valid.', error);
                }
                throw new Error("Authentication failed!")
            })
            await Auth.saveRefreshToken(jsonResponse.refreshToken)
            delete jsonResponse.firebaseToken
            delete jsonResponse.refreshToken
            return jsonResponse
        } catch (e) {
            throw e
        }
    }

    protected validateLogin({ email, password }) {
        return new Promise((res, rej) => {
            if (email && password) {
                // validate email
                if (!validator.isEmail(email)) return rej(new Error("Invalid email!"))
                if (!validator.matches(password, new RegExp('^[a-zA-Z0-9]{6,30}$'))) return rej(new Error("Password format is incorrect!"))
            } else {
                return rej(new Error("email and password must be provided"))
            }
            res(true)
        })
    }

    async requestPhoneVerification(data) {
        if (!this.app.signedIn()) throw new Error("You must sign in to continue!")
        try {
            const response = await this.app.initiateNetworkRequest(`${this.app.config.applicationHost}/api/persons/prepare`, {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-access-token': this.app.user!.token
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return await response.json()
        } catch (e) {
            throw e
        }
    }

    async verifyPhone(data) {
        if (!this.app.signedIn()) throw new Error("You must sign in to continue!")
        try {
            const response = await this.app.initiateNetworkRequest(`${this.app.config.applicationHost}/api/persons/verify`, {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-access-token': this.app.user!.token
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return
        } catch (e) {
            throw e
        }
    }

    async register(data) {
        const { email, firstName, lastName, password, country, dateOfBirth, role } = data
        try {
            await this.validateRegister(data)

            const response = await this.app.initiateNetworkRequest(`${this.app.config.applicationHost}/api/persons/new`, {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, firstName, lastName, password, country, dateOfBirth, role })
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            const jsonResponse = await response.json()
            await auth.signInWithCustomToken(jsonResponse.firebaseToken).catch(function (error) {
                let errorCode = error.code;
                if (errorCode === 'auth/invalid-custom-token') {
                    console.log('The token you provided is not valid.', error);
                }
                throw new Error("Authentication failed!")
            })
            await Auth.saveRefreshToken(jsonResponse.refreshToken)
            delete jsonResponse.firebaseToken
            delete jsonResponse.refreshToken
            return jsonResponse
        } catch (e) {
            throw e
        }
    }

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

    async loginViaFacebook() {
        try {
            await Facebook.initializeAsync('1978376125777682');
            const {
                type,
                token,
            }: any = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile'],
            });
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await this.app.initiateNetworkRequest(`https://graph.facebook.com/me?fields=birthday,hometown,email&access_token=${token}`);
            } else {
                // type === 'cancel'
            }
        } catch ({ message }) {
            console.error(`Facebook Login Error: ${message}`);
        }
    }
}