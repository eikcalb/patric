import { useNavigation } from "@react-navigation/native";
import { BlurView } from 'expo-blur';
import { Button, Container, Content, Form, Icon, Input, Item, Root, Spinner, Text, View } from "native-base";
import React, { useCallback, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { ShowToast } from "../components/utils";
import { APPLICATION_CONTEXT, APP_AUTH_CONTEXT } from "../lib";

export function Login() {
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
        <LoginForm onSuccess={successCallback} navigation={navigation} />
    )
}


function LoginForm({ onSuccess, navigation }) {
    const [state, setState] = useState({
        passwordShow: false,
        email: '',
        password: '',
        loading: false
    })
    const ctx = useContext(APPLICATION_CONTEXT)
    const onLoginPress = useCallback(() => {
        setState({ ...state, loading: true })
        ctx.loginUser(state.email, state.password)
            .then(user => onSuccess(user)).catch(e => {
                ShowToast({
                    text: e.message || "Please try again",
                    duration: 5000,
                    type: 'danger'
                })
            }).finally(() => setState({ ...state, loading: false }))
    }, [state])

    return (
        <Root>
            <BlurView tint='dark' intensity={100} style={styles.LoginRoot}>
                <Container style={styles.loginContainer}>
                    {/* @ts-ignore */}
                    <Content showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.loginContentContainer}>
                        <View style={styles.LoginBody}>
                            <Button danger rounded transparent onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Icon name='close-circle' />
                            </Button>
                            <Form style={styles.LoginForm}>
                                <Item rounded last style={styles.LoginInput}>
                                    <Input textContentType='emailAddress' placeholder="Email" value={state.email} autoCapitalize='none' onChangeText={email => { setState({ ...state, email }) }} />
                                </Item>
                                <Item rounded last style={styles.LoginInput}>
                                    <Input textContentType='password' secureTextEntry={!state.passwordShow} autoCapitalize='none' placeholder="Enter Password" value={state.password} onChangeText={password => { setState({ ...state, password }) }} />
                                    <Icon active name={state.passwordShow ? 'eye-off' : 'eye'} onPress={() => setState({ ...state, passwordShow: !state.passwordShow })} />
                                </Item>
                                <Button disabled={state.loading} success rounded block onPress={onLoginPress} style={styles.LoginInput}>
                                    {state.loading ? <Spinner color='white' size='small' /> : <Text>SIGN IN</Text>}
                                </Button>
                            </Form>
                        </View>
                    </Content>
                </Container>
            </BlurView>
        </Root >
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
})