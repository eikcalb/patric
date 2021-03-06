import React from 'react';
import { exp } from 'react-native-reanimated';
import renderer from 'react-test-renderer';
import { DEFAULT_APPLICATION } from '.';
import { User } from './user';

// expo-secure-storage is not available in this test environment, hence it is mocked here
jest.mock('expo-secure-store', () => {
    const store = {}

    return {
        getItemAsync: async (key) => {
            return store[key]
        },
        setItemAsync: async (key, value) => {
            store[key] = value
        },
        deleteItemAsync: async (key) => {
            delete store[key]
        }
    }
});

describe('Authentication Tests', () => {
    // used to randomize address
    const email = `${Date.now()}@gmail.com`
    // password used for test
    const password = 'Qwerty0000'
    it("Receives user data and creates a new user entry", async () => {
        const user = await DEFAULT_APPLICATION.registerUser({
            email,
            lastName: 'Doe',
            firstName: 'John',
            password
        })
        expect(user).toBeTruthy()
    })


    it("Receives username and password then authenticate user", async () => {
        const user = await DEFAULT_APPLICATION.loginUser(email, password)
        expect(user).toBeTruthy()
    })

    it("Deletes user object from application", async () => {
        const deleted = await DEFAULT_APPLICATION.deleteUser(email, password)
        expect(deleted).toBeTruthy()
    })
})