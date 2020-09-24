import React from 'react'
import { View, Toast } from 'native-base';
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

/**
 * Utility for horizontal view
 */
export function HorizontalView(props) {
    return (
        <View style={[styles.HorizontalView, props.style]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    HorizontalView: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    }
})



/**
 * Utility for displaying a toast to user.
 */
export function ShowToast({ type, text, duration = 8000, position = 'bottom', buttonText, textStyle, style, onClose, buttonTextStyle, buttonStyle }: {
    buttonText?: string,
    position?: "center" | "bottom" | "top",
    type?: "success" | "danger" | "warning",
    duration?: number, text: string, style?: StyleProp<ViewStyle>,
    onClose?: (reason: "user" | "timeout" | "functionCall") => any;
    textStyle?: StyleProp<TextStyle>;
    buttonTextStyle?: StyleProp<TextStyle>;
    buttonStyle?: StyleProp<ViewStyle>
}) {
    return Toast.show({
        text, duration, type,
        position: position === 'center' ? 'bottom' : position,
        buttonText, textStyle,
        style: position === 'center' ? [style, { bottom: '50%' }] : style,
        onClose, buttonStyle, buttonTextStyle,
    })
}
