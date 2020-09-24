import { useNavigation } from '@react-navigation/native';
import { requestCameraRollPermissionsAsync } from 'expo-image-picker';
import { Button, Container, Content, Icon, Root, Spinner, Text, View } from 'native-base';
import React, { useCallback, useContext, useState } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';
import { ShowToast } from '../components/utils';
import { APPLICATION_CONTEXT } from '../lib';

const Default_State = { loadingMedia: false, media: undefined, loading: false, success: false }
export function ProfilePhoto() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState<{ media: undefined | { uri: string, type?: string }, loading: boolean, loadingMedia: boolean, success: boolean }>(Default_State)
    const navigation = useNavigation()

    /**
     * Triggered to open image picker
     */
    const onSelectMedia = useCallback(async () => {
        try {
            setState({ ...state, loadingMedia: true })
            if (Platform.OS === 'ios') {
                let perms = await requestCameraRollPermissionsAsync()
                if (!perms.granted) {
                    ShowToast({ text: 'Access to media library denied!', type: 'danger' })
                    setState({ ...state, loadingMedia: false })
                    return
                }
            }
            const media = await ctx.getMediaPicture()
            console.log(media)
            setState({ ...state, media: { uri: media.uri }, loadingMedia: false })
        } catch (e) {
            ShowToast({ text: e.message, type: 'danger' })
            setState({ ...state, loadingMedia: false })
        }
    }, [state])

    /**
     * Logic to upload image
     */
    const onUpload = useCallback(async () => {
        setState({ ...state, loading: true })
        try {
            if (!ctx.user) {
                ShowToast({
                    type: 'danger',
                    text: "No user to upload"
                })
                return setState({ ...state, loading: false, success: false })
            }
            await ctx.uploadProfilePicture({ uri: state.media?.uri })
            setState({ ...state, loading: false, success: true })
            ShowToast({
                type: 'success',
                text: 'Successfully updated photo'
            })
        } catch (e) {
            console.error(e)
            setState({ ...state, loading: false, success: false })
            ShowToast({
                type: 'danger',
                text: e.message || "Failed to upload profile picture"
            })
        }
    }, [state])

    return (
        <Root>
            <Container style={styles.root}>
                {/* @ts-ignore */}
                <Content bounces={false} contentContainerStyle={styles.rootContainer}>
                    <View style={styles.headerStyle}>
                        <Text style={{ color: 'white', marginHorizontal: 16, fontWeight: 'bold', textTransform: 'uppercase' }}>Set profile picture</Text>
                        <Button style={{ alignSelf: 'flex-end' }} transparent onPress={() => {
                            navigation.goBack()
                        }}>
                            <Icon style={[styles.headerButtonIcon, { fontSize: 32 }]} name='close' />
                        </Button>
                    </View>

                    <View style={{ flex: 1 }}>
                        <View style={[styles.mediaWrapperStyle, { backgroundColor: state.media ? 'black' : 'white' }]}>
                            {state.media ?
                                <Image resizeMode='contain' style={styles.mediaStyle} source={state.media} />
                                : (
                                    <Text style={{ textAlign: 'center', textTransform: 'uppercase', color: '#aaa', padding: 16, fontSize: 16 }} >Select your profile picture</Text>
                                )}
                        </View>
                        <View padder style={[{
                            alignSelf: 'stretch',
                            flex: 1,
                            borderBottomStartRadius: 360,
                            borderBottomEndRadius: 360,
                            backgroundColor: 'black',
                            justifyContent: 'center', alignItems: 'center',
                        }]}>
                            <Button block rounded disabled={state.loading} style={styles.mediaButton} onPress={onSelectMedia} >
                                {state.loadingMedia ? <Spinner color='black' size='small' /> : <Text style={styles.mediaButtonText}>Select Media</Text>}
                            </Button>
                            <Button block rounded disabled={!state.media || state.loading} style={[styles.mediaButton, !state.media ? { backgroundColor: '#aaa' } : null]} onPress={onUpload}>
                                {state.loading ? <Spinner color='black' size='small' /> : <Text style={styles.mediaButtonText}>Upload</Text>}
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        </Root>
    )
}


const styles = StyleSheet.create({
    root: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center'
    },
    rootContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    headerButtonIcon: {
        color: 'white',
        fontWeight: 'bold'
    },
    headerStyle: {
        backgroundColor: 'black',
        paddingTop: 0,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderBottomColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    drawerTop: {
        padding: 32,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#f00',
        borderBottomWidth: StyleSheet.hairlineWidth
    }, mediaWrapperStyle: {
        flex: 1,
        margin: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'stretch'
    },
    mediaStyle: {
        flex: 1,
    },
    mediaButton: {
        margin: 8,
    },
    mediaButtonText: {
        color: 'black',
        textTransform: 'uppercase',
        fontSize: 12,
        fontWeight: 'bold'
    },
    modalStyle: {
        position: 'absolute',
        bottom: 0,
        start: 0,
        end: 0,
        padding: 36,
        paddingBottom: 48,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalTextStyle: {
        color: 'black',
        textTransform: 'capitalize',
        fontWeight: 'bold',
        fontSize: 24
    }
})