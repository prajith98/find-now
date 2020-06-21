import React, {Component} from 'react';
import { Camera } from 'expo-camera';
import { View, Text, BackHandler } from 'react-native';
import * as Permissions from 'expo-permissions';
import { withNavigationFocus } from "react-navigation";
import styles from './stylesCam';
import Toolkit from './Toolkit';
import Firebase, { db } from '../../../database/firebase';

class CameraScreen extends Component {
    constructor(props) {
        super(props)
        this.camera = null;
        this.state = {
            captures: [],
            capturing: null,
            hasCameraPermission: null,
            cameraType: Camera.Constants.Type.front,
            flashMode: Camera.Constants.FlashMode.off,
        };
    }

    setFlashMode = (flashMode) => this.setState({ flashMode });
    setCameraType = (cameraType) => this.setState({ cameraType });
    handleCaptureIn = () => this.setState({ capturing: true });

    handleCaptureOut = () => {
        if (this.state.capturing)
            this.camera.stopRecording();
    };

    handleShortCapture = async () => {
        const photoData = await this.camera.takePictureAsync();
        const updateDBRef = db.collection('users').doc(Firebase.auth().currentUser.uid);
        updateDBRef.update({
            photoUrl: photoData.uri

        })
        Firebase.auth().currentUser.updateProfile({
            photoURL: photoData.uri
        })
        this.props.navigation.navigate('ProfileScreen');
        this.setState({ capturing: false })
    };


    async componentDidMount() {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const hasCameraPermission = (camera.status === 'granted');

        this.setState({ hasCameraPermission });
    }
    render() {
        const { hasCameraPermission, flashMode, cameraType, capturing, captures } = this.state;
        const isFocused = this.props.navigation.isFocused();
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>Access to camera has been denied.</Text>;
        }
        if (!isFocused) {
            return null;
        } else if (isFocused) {
            return (
                <React.Fragment>
                    <View>
                        <Camera
                            type={cameraType}
                            flashMode={flashMode}
                            style={styles.preview}
                            ref={camera => this.camera = camera}
                        />
                    </View>
                    <Toolkit
                        capturing={capturing}
                        flashMode={flashMode}
                        cameraType={cameraType}
                        setFlashMode={this.setFlashMode}
                        setCameraType={this.setCameraType}
                        onCaptureIn={this.handleCaptureIn}
                        onCaptureOut={this.handleCaptureOut}
                        onLongCapture={this.handleLongCapture}
                        onShortCapture={this.handleShortCapture}
                    />
                </React.Fragment>
            );
        }
    };
};
export default withNavigationFocus(CameraScreen);