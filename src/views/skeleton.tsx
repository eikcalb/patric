import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { APPLICATION_CONTEXT, APP_AUTH_CONTEXT } from '../lib';
import { Home } from './home';
import { Login } from './login';
import { Register } from './register';

const NavStack = createStackNavigator()

export function Skeleton() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const authCTX = useContext(APP_AUTH_CONTEXT)

    return (
        <NavigationContainer>
            <NavStack.Navigator headerMode={'none'} screenOptions={{ gestureEnabled: false }}>
                {
                    // Check if user is currently signed in before displaying auth flow or user page.
                    // This serves like a switch to clear the navigation history in such a way that once authenticated,
                    // the user cannot go back to the auth screen, unless the user logs out.
                    authCTX.signedIn ? (
                        <>
                            <NavStack.Screen name='Home' component={Home} />
                        </>
                    ) : (
                            <>
                                <NavStack.Screen name="Login" component={Login} />
                                <NavStack.Screen name='Register' component={Register} />
                            </>
                        )}
            </NavStack.Navigator>
        </NavigationContainer>
    )
}