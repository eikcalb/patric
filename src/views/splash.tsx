import { useNavigation } from "@react-navigation/native";
import { BlurView } from 'expo-blur';
import { Button, Container, Content, Form, Icon, Input, Item, Root, Spinner, Text, View } from "native-base";
import React, { useCallback, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { ShowToast } from "../components/utils";
import { APPLICATION_CONTEXT, APP_AUTH_CONTEXT } from "../lib";

export function Splash() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const ctx2 = useContext(APP_AUTH_CONTEXT)
    const navigation = useNavigation()

    return (
        <Root>
            <Container style={styles.root}>
                {/* @ts-ignore */}
                <Content showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.bodyCover}>
                        <View style={styles.body}>
                            <View style={styles.title}>
                                <Text style={styles.titleText}>PATRIC</Text>
                            </View>
                            <View style={styles.options}>
                                <Button success rounded block onPress={() => navigation.navigate('Login')} style={styles.button}>
                                    <Text>SIGN IN</Text>
                                </Button>
                                <Button success dark rounded block onPress={() => navigation.navigate('Register')} style={styles.button}>
                                    <Text>REGISTER</Text>
                                </Button>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.footer}>{`\u00A9 ${ctx.name} - v${ctx.version}`}</Text>
                </Content>
            </Container>
        </Root >
    )
}

const styles = StyleSheet.create({
    title: {
        paddingVertical: 20,
    },
    titleText: {
        marginVertical: 32,
        fontWeight: 'bold',
        fontSize: 44,
        textAlign: 'center',
        color:'#000',
        textAlignVertical: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 16
    },
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#eee'
    },
    footer: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        color: '#aaa',
    },
    bodyCover: {
        flex: 1,
        justifyContent:'center'
    },
    body: {
        margin: 20,
        backgroundColor: "#fafafa",
        borderRadius: 16,
        padding: 8,
        alignItems: "stretch",
        shadowColor: "#000",
        justifyContent: 'center',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    options: {
        justifyContent: 'space-between',
        alignItems: 'stretch',
        margin: 8,
        marginTop: 20,
        flexGrow: 1
    },
    button: {
        marginVertical: 8
    },
})