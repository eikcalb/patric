import { useNavigation } from "@react-navigation/native";
import { BlurView } from 'expo-blur';
import { Button, Container, Content, Form, Icon, Input, Item, Root, Spinner, Text, View } from "native-base";
import React, { useCallback, useContext, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { HorizontalView, ShowToast } from "../components/utils";
import { APPLICATION_CONTEXT, APP_AUTH_CONTEXT } from "../lib";

export function Register() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const ctx2 = useContext(APP_AUTH_CONTEXT)
    const navigation = useNavigation()
    const successCallback = (user) => {
        // If authentication is initiated for login, update signed in state
        if (ctx.user) {
            ctx2.setSignedInState(user)
        }
    }

    return (
        <RegisterForm onSuccess={successCallback} onRequestClose={navigation.goBack} />
    )
}

function RegisterForm({ onSuccess, onRequestClose }) {
    const defaultState = {
        passwordShow: false,
        passwordVerifyShow: false,
        firstName: 'john',
        lastName: 'doe',
        email: 'zz@gmail.com',
        password: 'Qwerty00',
        passwordVerify: 'Qwerty00',
        loading: false
    }
    const [state, setState] = useState(defaultState || {
        passwordShow: false,
        passwordVerifyShow: false,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordVerify: '',
        loading: false
    })
    const ctx = useContext(APPLICATION_CONTEXT)
    const onSignUpPress = useCallback(() => {
        setState({ ...state, loading: true })
        if (state.passwordVerify !== state.password) {
            Alert.alert("Registration Failed", "Password must match")
            setState({ ...state, loading: false })
            return
        }
        ctx.registerUser({ password: state.password, email: state.email, firstName: state.firstName, lastName: state.lastName })
            .then(user => onSuccess(user)).catch(e => {
                console.log(e)
                Alert.alert("Registration Failed", e.message || "Please try again")
            }).finally(() => setState({ ...state, loading: false }))
    }, [state])

    return (
        <Root>
            <BlurView tint='dark' intensity={100} style={styles.LoginRoot}>
                <Container style={styles.container}>
                    {/* @ts-ignore */}
                    <Content bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                        <View style={styles.RegisterBody}>
                            <Button danger rounded transparent onPress={onRequestClose} style={styles.backButton}>
                                <Icon name='close-circle' />
                            </Button>
                            <Form style={styles.RegForm}>
                                <Item rounded last style={styles.Input}>
                                    <Input placeholder='First Name' value={state.firstName} onChangeText={firstName => { setState({ ...state, firstName }) }} />
                                </Item>
                                <Item rounded last style={styles.Input}>
                                    <Input placeholder='Last Name' value={state.lastName} onChangeText={lastName => { setState({ ...state, lastName }) }} />
                                </Item>
                                <Item rounded last style={styles.Input}>
                                    <Input textContentType='emailAddress' placeholder="Email" value={state.email} autoCapitalize='none' onChangeText={email => { setState({ ...state, email }) }} />
                                </Item>
                                <Item rounded last style={styles.Input}>
                                    <Input textContentType='password' secureTextEntry={!state.passwordShow} autoCapitalize='none' placeholder="Enter Password" value={state.password} onChangeText={password => { setState({ ...state, password }) }} />
                                    <Icon active name={state.passwordShow ? 'eye-off' : 'eye'} onPress={() => setState({ ...state, passwordShow: !state.passwordShow })} />
                                </Item>
                                <Item rounded last style={styles.Input}>
                                    <Input textContentType='password' secureTextEntry={!state.passwordVerifyShow} placeholder="Repeat your password" value={state.passwordVerify} onChangeText={passwordVerify => { setState({ ...state, passwordVerify }) }} />
                                    <Icon active name={state.passwordShow ? 'eye-off' : 'eye'} onPress={() => setState({ ...state, passwordShow: !state.passwordShow })} />
                                </Item>

                                <Button success rounded disabled={state.loading} block onPress={onSignUpPress} style={styles.Input}>
                                    {state.loading ? <Spinner color='white' size='small' /> : <Text>SIGN UP</Text>}
                                </Button>
                            </Form>
                        </View>
                    </Content>
                </Container>
            </BlurView>
        </Root>
    )
}


const styles = StyleSheet.create({

    container: { backgroundColor: 'transparent', flex: 1 },
    backButton: { alignSelf: 'flex-end', position: 'absolute', end: -8, top: -8 },
    contentContainer: { flex: 1, justifyContent: 'center', padding: 16 },
    LoginRoot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#1114'
    },
    RegisterBody: {
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
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    RegForm: {
        justifyContent: 'space-between',
        alignItems: 'stretch',
        margin: 8,
        marginTop: 20,
        flexGrow: 1
    },
    Input: {
        marginVertical: 8
    },
})