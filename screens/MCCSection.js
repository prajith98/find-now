import MCCScreen from './MCCScreen'
import ScheduleScreen2 from './ScheduleScreen2'
import { createStackNavigator } from 'react-navigation-stack'
const MCCStack = createStackNavigator({
    MCCScreen: {
        screen: MCCScreen,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        }),
    },
    ScheduleScreen2: {
        screen: ScheduleScreen2,
        navigationOptions: ({ navigation }) => ({
            headerShown: false
        })
    },
}, {
    initialRouteParams: "MCCScreen",
})
export default MCCStack