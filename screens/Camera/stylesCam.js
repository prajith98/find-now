import { StyleSheet, Dimensions } from 'react-native';
import normalize from 'react-native-normalize';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

export default StyleSheet.create({
    alignCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    preview: {
        height: winHeight,
        width: winWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    bottomToolbar: {
        width: winWidth,
        position: 'absolute',
        height: 100,
        bottom: 0,
    },
    captureBtn: {
        width: normalize(60),
        height: normalize(60),
        borderWidth: 2,
        borderRadius: normalize(60),
        borderColor: "#FFFFFF",
    },
    captureBtnActive: {
        width: normalize(80),
        height: normalize(80),
    },
    captureBtnInternal: {
        width: normalize(76),
        height: normalize(76),
        borderWidth: 2,
        borderRadius: normalize(76),
        backgroundColor: "red",
        borderColor: "transparent",
    },
});