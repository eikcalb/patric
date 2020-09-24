import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { APPLICATION_CONTEXT, APP_AUTH_CONTEXT, DEFAULT_APPLICATION } from './src/lib';
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { User } from './src/lib/user';
import { Root } from 'native-base';
import { AppLoading } from 'expo';
import { Skeleton } from './src/views/skeleton';

export default function App() {
  const [state, setState] = useState({ ready: false })
  const [signedInState, setSignedInState] = useState<User | boolean>(false)
  React.useEffect(() => {
    // Prepare application and load dependencies
    Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    }).then(async () => {
      DEFAULT_APPLICATION.inflateSession().then((user) => {
        setSignedInState(user)
      }).catch(e => console.log(e)).finally(() => {
        setState({ ready: true })
      })
    })

  }, [])


  const authContext = { signedIn: signedInState, setSignedInState }

  if (!state.ready) {
    return (
      <Root>
        <AppLoading />
      </Root>
    )
  }

  return (
    <Root>
      <APPLICATION_CONTEXT.Provider value={DEFAULT_APPLICATION} >
        <APP_AUTH_CONTEXT.Provider value={authContext}>
           <Skeleton>
        </APP_AUTH_CONTEXT.Provider>
      </APPLICATION_CONTEXT.Provider>
    </Root>
  );
}

