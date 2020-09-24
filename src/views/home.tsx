import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ActionSheet, Button, Container, Content, Text, Thumbnail, View } from 'native-base';
import React, { useCallback, useContext } from 'react';
import { Modal, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { ShowToast } from '../components/utils';
import { APPLICATION_CONTEXT, APP_AUTH_CONTEXT } from '../lib';
import { ProfilePhoto } from './setphoto';

/**
 * Root navigator for homepage. Thi navigator will contain the routes for updating profilePhoto and displaying data.
 */
const HomeNav = createStackNavigator()
export function Home() {
    return (
        <HomeNav.Navigator headerMode='none'>
            <HomeNav.Screen name='Home' component={HomePage} />
            <HomeNav.Screen name='SetPhoto' component={ProfilePhoto} />
        </HomeNav.Navigator>
    )
}

export function HomePage() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const authCTX = useContext(APP_AUTH_CONTEXT)
    const navigation = useNavigation()

    // Callback for when the photo space is touched.
    const onPressPhoto = useCallback(() => {
        ActionSheet.show({
            title: "Select an action",
            options: [
                "Upload Photo", "Cancel"
            ],
            cancelButtonIndex: 1
        }, (i) => {
            switch (i) {
                case 0:
                    navigation.navigate('SetPhoto')
                    break;
            }
        })
    }, [])

    const onLogoutPress = useCallback(() => {
        ctx.deleteUserSession()
            .then(() => authCTX.setSignedInState(false))
            .catch(e => {
                ShowToast({
                    text: e.message || 'Failed to remove session',
                    type: 'danger'
                })
            })
    }, [])

    const user = ctx.user!

    return (
        <Container style={styles.root}>
            {/* @ts-ignore */}
            <Content bounces={false} contentContainerStyle={styles.content}>
                <View>
                    {/* @ts-ignore */}
                    <LinearGradient colors={['black', 'white']} start={[0, 0.7]} end={[0, 0.71]} locations={[0, 0.5]} >
                        <View padder style={styles.photoContainer}>
                            <Text style={styles.fullnameTitle}>{`${ctx.user?.firstName} ${ctx.user?.lastName}`}</Text>
                            <TouchableNativeFeedback onPress={onPressPhoto}>
                                <Thumbnail style={styles.thumbnail} large source={{ uri: ctx.user?.thumbnailURL }} defaultSource={require('../../assets/icon.png')} />
                            </TouchableNativeFeedback>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.profileContent}>
                    <Text style={styles.email}>{ctx.user?.email}</Text>
                    <Button success rounded block onPress={onLogoutPress} style={styles.Input}>
                        <Text>LOGOUT</Text>
                    </Button>
                </View>
            </Content>
        </Container >)
}

const styles = StyleSheet.create({
    root: { backgroundColor: 'white', flex: 1 },
    photoContainer: {
        alignSelf: 'stretch',
        alignContent: 'center',
        justifyContent: 'center', alignItems: 'center',
    },
    profileContent: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between', alignItems: 'center'
    },
    headerButtonIcon: {
        color: 'white',
        fontWeight: 'bold'
    },
    content: {
        flexGrow: 1, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'stretch'
    },
    fullnameTitle: {
        color: 'white', margin: 8, textTransform: 'capitalize', fontWeight: 'bold', fontSize: 28
    },
    email: {
        color: 'black', margin: 8, textTransform: 'capitalize'
    },
    thumbnail: {
        height: 120,
        width: 120,
        borderRadius: 120,
        marginTop: 16,
        backgroundColor: 'white',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'black'
    },
    mediaStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
    mediaButton: {
        margin: 8,
        backgroundColor: 'white',
    },
    mediaButtonText: {
        color: 'black',
        textTransform: 'uppercase',
        fontSize: 12,
        fontWeight: 'bold'
    },
    Input: {
        margin: 8
    },
})