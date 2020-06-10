import ProfileScreen from './ProfileScreen'
import CameraScreen from './Camera/CameraScreen'
import OtpVerifyScreen from './OtpVerifyScreen'
import { createStackNavigator } from 'react-navigation-stack'
const ProfileStack = createStackNavigator({
    ProfileScreen: {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        }),
    },
    CameraScreen: {
        screen: CameraScreen,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },
    OtpVerifyScreen: {
        screen: OtpVerifyScreen,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },
}, {
    initialRouteParams: "ProfileScreen",
})
export default ProfileStack