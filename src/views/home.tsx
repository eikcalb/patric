import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { ActionSheet, Button, Container, Content, Icon, Input, Item, Root, Spinner, Text, Thumbnail, View } from 'native-base';
import React, { useCallback, useContext, useState } from 'react';
import { Modal, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { HorizontalView, ShowToast } from '../components/utils';
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
    const [state, setState] = useState({ loading: false, passwordShow: false, password: '', showModal: false })

    // Callback for when the photo space is touched.
    const onPressPhoto = () => {
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
    }

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

    const onDeleteAccount = useCallback((password) => {
        ctx.deleteUser(ctx.user?.email, password)
            .then(() => authCTX.setSignedInState(false))
            .catch(e => {
                ShowToast({
                    text: e.message || 'Failed to delete account',
                    type: 'danger'
                })
            })
    }, [])

    const user = ctx.user!

    return (
        <Root>
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
                        <HorizontalView style={{
                            margin:8,
                            alignItems:'center'}}>
                            <Icon name='mail' />
                            <Text style={styles.email}>{ctx.user?.email}</Text>
                        </HorizontalView>
                        <View style={styles.options}>
                            <Button success rounded block onPress={onLogoutPress} style={styles.Input}>
                                <Text>LOGOUT</Text>
                            </Button>
                            <Button danger rounded block onPress={() => setState({ ...state, showModal: true })} style={styles.Input}>
                                <Text>DELETE ACCOUNT</Text>
                            </Button>
                        </View>
                    </View>
                    {state.showModal ? (
                        <View style={[StyleSheet.absoluteFill, styles.modal]}>
                            <View style={styles.LoginBody}>
                                <Button danger rounded transparent onPress={() => setState({ ...state, showModal: false })} style={styles.backButton}>
                                    <Icon name='close-circle' />
                                </Button>
                                <View style={styles.LoginForm}>
                                    <Item rounded last style={styles.LoginInput}>
                                        <Input textContentType='password' secureTextEntry={!state.passwordShow} autoCapitalize='none' placeholder="Re-enter password to confirm" value={state.password} onChangeText={password => { setState({ ...state, password }) }} />
                                        <Icon active name={state.passwordShow ? 'eye-off' : 'eye'} onPress={() => setState({ ...state, passwordShow: !state.passwordShow })} />
                                    </Item>
                                    <Button disabled={state.loading} danger rounded block onPress={() => onDeleteAccount(state.password)} style={styles.Input}>
                                        {state.loading ? <Spinner color='white' size='small' /> : <Text>DELETE ACCOUNT</Text>}
                                    </Button>
                                </View>
                            </View>
                        </View>
                    ) : null}
                </Content>
            </Container >
        </Root>
    )
}

const styles = StyleSheet.create({
    loginContainer: { backgroundColor: 'transparent', flex: 1 },
    backButton: { alignSelf: 'flex-end', position: 'absolute', end: -8, top: -8 },
    loginContentContainer: { flex: 1, justifyContent: 'center', padding: 16 },
    LoginRoot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'transparent'
    },
    LoginBody: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 8,
        alignItems: "stretch",
        shadowColor: "#000",
        justifyContent: 'flex-start',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5
    },
    LoginForm: {
        justifyContent: 'space-between',
        alignItems: 'stretch',
        margin: 8,
        marginTop: 32,
        flexGrow: 1
    },
    LoginInput: {
        marginVertical: 8
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000e'
    },
    options: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        padding: 16,
        flex: 1
    },
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
        color: 'black', margin: 8, fontSize:20,textTransform: 'lowercase',fontWeight:'bold'
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