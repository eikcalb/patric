import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { APPLICATION_CONTEXT, DEFAULT_APPLICATION } from './src/lib';

export default function App() {
  return (
    <APPLICATION_CONTEXT.Provider value={DEFAULT_APPLICATION} >
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </APPLICATION_CONTEXT.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
