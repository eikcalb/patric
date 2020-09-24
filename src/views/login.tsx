import React, { useState, useContext } from "react";
import { Container, Content, H1, Text, View, Button, Icon, Form, Item, Input, CheckBox, Label, Picker, Toast, Spinner, Root } from "native-base";
import { Modal, StyleSheet, TouchableNativeFeedback, Platform, TouchableOpacity, Alert } from "react-native";
import { HorizontalView, ShowToast } from "../components/utils";
import { APPLICATION_CONTEXT, APP_AUTH_CONTEXT, GLOBAL_AUTH_CONTEXT } from "../lib";
import { User } from "../lib/user";
import { StatusBar } from "expo-status-bar";
import { useNavigation, StackActions } from "@react-navigation/native";
import countries from '../../assets/countries.json'
import months from '../../assets/months.json'
import { BlurView } from 'expo-blur'
import { ModalType } from "../lib/ModalType";

export function Login() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const ctx2 = useContext(APP_AUTH_CONTEXT)
    const navigation = useNavigation()
    const successCallback = (user) => {
        // If authentication is initiated for login, update signed in state
        if (ctx.user) {
            ctx2.setSignedInState(ctx.user)
        }
    }

    return (
        <LoginForm onSuccess={successCallback} />
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
        country: '',
        month: undefined,
        day: '1',
        year: '1990',
        role: 'player',
        terms: false,
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
        country: undefined,
        month: undefined,
        day: '',
        year: '',
        role: 'player',
        terms: false,
        loading: false
    })
    const ctx = useContext(APPLICATION_CONTEXT)

    return (
        <Root>
            <Container style={styles.RegisterRoot}>
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
                        <Item rounded picker style={styles.RegisterInput}>
                            <Picker mode="dialog"
                                prompt="Select Your Country"
                                iosHeader="Select Your Country"
                                selectedValue={state.country}
                                onValueChange={country => {
                                    setState({ ...state, country })
                                }}
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: '100%' }}
                                placeholder="Select Your Country"
                                placeholderStyle={{ color: "#888", maxWidth: '100%' }}
                                textStyle={{ maxWidth: '100%' }}
                                placeholderIconColor="#007aff">
                                {countries.map(country => <Picker.Item label={country.name} value={country.name} key={country.name} />)}
                            </Picker>
                        </Item>
                        <HorizontalView>
                            <Item rounded last picker style={[styles.RegisterInput, { flex: 3, paddingStart: 8 }]}>
                                <Picker mode="dialog"
                                    prompt="Select Birth Month"
                                    iosHeader="Select Birth Month"
                                    selectedValue={state.month}
                                    onValueChange={month => {
                                        setState({ ...state, month })
                                    }}
                                    iosIcon={<Icon name="arrow-down" />}
                                    style={{ width: undefined }}
                                    placeholder="Month"
                                    placeholderStyle={{ color: "#888" }}
                                    placeholderIconColor="#007aff">
                                    {months.map(item => <Picker.Item key={item.id} label={item.name} value={item.id} />)}

                                </Picker>
                            </Item>
                            <Item rounded last style={[styles.RegisterInput, { flex: 2, paddingStart: 8 }]}>
                                <Input placeholder='Day' value={state.day} onChangeText={day => {
                                    setState({ ...state, day })
                                }} />
                            </Item>
                            <Item rounded last style={[styles.RegisterInput, { flex: 2, paddingStart: 8 }]}>
                                <Input placeholder='Year' value={state.year} onChangeText={year => {
                                    setState({ ...state, year })
                                }} />
                            </Item>
                        </HorizontalView>
                        <Item rounded picker style={styles.RegisterInput}>
                            <Picker mode="dialog"
                                prompt="Select Your Role"
                                iosHeader="Select Your Role"
                                selectedValue={state.role}
                                onValueChange={role => {
                                    setState({ ...state, role })
                                }}
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: '80%' }}
                                placeholder="Select Your Role"
                                placeholderStyle={{ color: "#888", maxWidth: '100%' }}
                                textStyle={{ maxWidth: '100%' }}
                                placeholderIconColor="#007aff">
                                <Picker.Item label={"Player"} value={'player'} key={'player'} />
                                <Picker.Item label={"Manager"} value={'manager'} key={'manager'} />
                            </Picker>
                        </Item>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center", margin: 16 }} onPress={() => {
                            setState({ ...state, terms: !state.terms })
                        }} >
                            <CheckBox disabled checked={state.terms} color="green" style={{ margin: 8 }} />
                            <Text style={{ marginStart: 12, color: 'white' }}>Accept the Terms and Conditions</Text>
                        </TouchableOpacity>
                        <Button success rounded disabled={state.loading} block onPress={() => {
                            setState({ ...state, loading: true })
                            if (!state.terms) {
                                Alert.alert("Registration Failed", "You must accept thte terms and conditions before proceeding")
                                setState({ ...state, loading: false })
                                return
                            }
                            if (state.passwordVerify !== state.password) {
                                Alert.alert("Registration Failed", "Password must match")
                                setState({ ...state, loading: false })
                                return
                            }
                            ctx.registerUser({ role: state.role, password: state.password, email: state.email, firstName: state.firstName, lastName: state.lastName, dateOfBirth: `${state.year}-${String(state.month)}-${state.day}`, country: state.country })
                                .then(user => onSuccess(user)).catch(e => {
                                    console.log(e)
                                    Alert.alert("Registration Failed", e.message || "Please try again")
                                }).finally(() => setState({ ...state, loading: false }))
                        }} style={{ marginVertical: 8 }}>
                            {state.loading ? <Spinner color='white' size='small' /> : <Text>SIGN UP</Text>}
                        </Button>
                    </Form>
                </Content>
            </Container>
        </Root>
    )
}

function LoginForm({ onSuccess }) {
    const [state, setState] = useState({
        passwordShow: false,
        email: '',
        password: '',
        loading: false
    })
    const ctx = useContext(APPLICATION_CONTEXT)

    return (
        <Root>
            <BlurView tint='dark' intensity={100} style={styles.LoginRoot}>
                <Container style={{ backgroundColor: 'transparent', flex: 1 }}>
                    {/* @ts-ignore */}
                    <Content showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flex: 1, justifyContent: 'center', padding: 16 }}>
                        <View style={styles.LoginBody}>
                            <Form style={styles.LoginForm}>
                                <Item rounded last style={styles.LoginInput}>
                                    <Input textContentType='emailAddress' placeholder="Email" value={state.email} autoCapitalize='none' onChangeText={email => {
                                        setState({ ...state, email })
                                    }} />
                                </Item>
                                <Item rounded last style={styles.LoginInput}>
                                    <Input textContentType='password' secureTextEntry={!state.passwordShow} autoCapitalize='none' placeholder="Enter Password" value={state.password} onChangeText={password => {
                                        setState({ ...state, password })
                                    }} />
                                    <Icon active name={state.passwordShow ? 'eye-off' : 'eye'} onPress={() => setState({ ...state, passwordShow: !state.passwordShow })} />
                                </Item>
                                <Button disabled={state.loading} success rounded block onPress={() => {
                                    setState({ ...state, loading: true })
                                    ctx.loginUser(state.email, state.password)
                                        .then(user => onSuccess(user)).catch(e => {
                                            ShowToast({
                                                text: e.message || "Please try again",
                                                duration: 5000,
                                                type: 'danger'
                                            })
                                        }).finally(() => setState({ ...state, loading: false }))
                                }} style={styles.LoginInput}>
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