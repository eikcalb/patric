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
            <Container style={styles.RegisterRoot}>
                {/* @ts-ignore */}
                <Content bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.RegisterBody}>
                    <View style={styles.RegisterBodyHeader}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>SIGN UP</Text>
                        <Button dark onPress={onRequestClose} style={{ alignSelf: 'flex-end' }}>
                            <Icon name='close' />
                        </Button>
                    </View>

                    <Form style={styles.RegisterForm}>
                        <HorizontalView>
                            <Item rounded last style={[styles.RegisterInput, { flex: 1, paddingStart: 8 }]}>
                                <Input placeholder='First Name' value={state.firstName} onChangeText={firstName => {
                                    setState({ ...state, firstName })
                                }} />
                            </Item>
                            <Item rounded last style={[styles.RegisterInput, { flex: 1, paddingStart: 8 }]}>
                                <Input placeholder='Last Name' value={state.lastName} onChangeText={lastName => {
                                    setState({ ...state, lastName })
                                }} />
                            </Item>
                        </HorizontalView>
                        <Item rounded last style={styles.RegisterInput}>
                            <Input placeholder='Enter Email Address' value={state.email} onChangeText={email => {
                                setState({ ...state, email })
                            }} />
                        </Item>
                        <Item rounded last style={styles.RegisterInput}>
                            <Input textContentType='password' secureTextEntry={!state.passwordShow} placeholder="Create your strong password" value={state.password} onChangeText={password => {
                                setState({ ...state, password })
                            }} />
                            <Icon active name={state.passwordShow ? 'eye-off' : 'eye'} onPress={() => setState({ ...state, passwordShow: !state.passwordShow })} />
                        </Item>
                        <Item rounded last style={styles.RegisterInput}>
                            <Input textContentType='password' secureTextEntry={!state.passwordVerifyShow} placeholder="Repeat your password" value={state.passwordVerify} onChangeText={passwordVerify => {
                                setState({ ...state, passwordVerify })
                            }} />
                            <Icon active name={state.passwordVerifyShow ? 'eye-off' : 'eye'} onPress={() => setState({ ...state, passwordVerifyShow: !state.passwordVerifyShow })} />
                        </Item>
                        <Button success rounded disabled={state.loading} block onPress={onSignUpPress} style={{ marginVertical: 8 }}>
                            {state.loading ? <Spinner color='white' size='small' /> : <Text>SIGN UP</Text>}
                        </Button>
                        <Button>
                            <Text>REGISTER</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        </Root>
    )
}


const styles = StyleSheet.create({
    LoginRoot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#1114'
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
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    LoginForm: {
        justifyContent: 'space-between',
        alignItems: 'stretch',
        margin: 8,
        marginTop: 20,
        flexGrow: 1
    },
    LoginInput: {
        marginVertical: 8
    },
    RegisterRoot: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'black',
    },
    RegisterBody: {
        backgroundColor: 'black',
        color: 'white'
    },
    RegisterBodyHeader: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderBottomColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    RegisterForm: {
        justifyContent: 'center',
        alignItems: 'stretch',
        margin: 16,
    },
    RegisterInput: {
        backgroundColor: 'white',
        margin: 16,
    }
})