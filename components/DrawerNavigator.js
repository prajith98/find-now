import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer'
import { Dimensions, Text, StyleSheet } from 'react-native'
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'
import Firebase from '../database/firebase';
import NewsScreen from '../screens/NewsScreen';
import SignOutScreen from '../screens/SignOutScreen'
import ContactScreen from '../screens/ContactScreen'
import LPScreen from '../screens/LPScreen'
import SideBar from '../components/SideBar'
import HomeScreen from '../screens/HomeScreen'
import BankScreen from '../screens/BankScreen'
import ProfileStack from '../screens/ProfileSection';
import { RFValue } from "react-native-responsive-fontsize";
import ScheduleScreen from '../screens/ScheduleScreen';
import { LoanScreen, EMIScreen, RateScreen, TenureScreen } from '../screens';
import MCCStack from '../screens/MCCSection';
import FeedBackScreen from '../screens/FeedbackScreen'
import CompareLoanStack from '../screens/CompareLoanStack';
import CLScreen2 from '../screens/CLScreen2';
import CompareLoanStack2 from '../screens/CompareLoanStack2';
import normalize from 'react-native-normalize';
const { windowWidth, windowHeight } = Dimensions.get('window');
class Hidden extends React.Component {
    render() {
        return null;
    }
}
const DrawerNavigator = createDrawerNavigator({
    HomeScreen: {
        screen: HomeScreen,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <Feather name="home" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>Home</Text>

        }
    },
    ProfileScreen: {
        screen: ProfileStack,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <Feather name="user" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>Profile</Text>
        }
    },
    MCCScreen: {
        screen: MCCStack,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <FontAwesome5 name="elementor" size={15} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>Moratorium Calculator (COVID-19)</Text>
        }
    },
    EMIScreen: {
        screen: EMIScreen,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <FontAwesome5 name="calculator" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>EMI Calculator</Text>
        }
    },
    LoanScreen: {
        screen: LoanScreen,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <MaterialCommunityIcons name="sack" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>Loan Eligibility Check</Text>
        }
    },
    RateScreen: {
        screen: RateScreen,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <Feather name="percent" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>Interest Rate Calculator</Text>
        }
    },
    TenureScreen: {
        screen: TenureScreen,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <Feather name="clock" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>Tenure Calculator</Text>
        }
    },
    CLScreen: {
        screen: CompareLoanStack,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <FontAwesome5 name="columns" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>Compare Loan</Text>
        },
    },
    LPScreen: {
        screen: LPScreen,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <FontAwesome5 name="clipboard-list" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>Track your loan</Text>
        }
    },
    NewsScreen: {
        screen: NewsScreen,
        navigationOptions: {
            drawerLabel: <Hidden />
        }
    },
    BankScreen: {
        screen: BankScreen,
        navigationOptions: {
            drawerLabel: <Hidden />
        }
    },
    ScheduleScreen: {
        screen: ScheduleScreen,
        navigationOptions: {
            drawerLabel: <Hidden />
        }
    },
    FeedBackScreen: {
        screen: FeedBackScreen,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <MaterialIcons name="feedback" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>FeedBack</Text>
        }
    },
    ContactScreen: {
        screen: ContactScreen,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <Feather name="phone-call" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>Contact Us</Text>
        }
    },
    SignOutScreen: {
        screen: SignOutScreen,
        navigationOptions: {
            drawerIcon: ({ tintColor }) => <Feather name="log-out" size={16} color={tintColor} />,
            drawerLabel: () => <Text style={styles.label}>Logout</Text>
        }
    }
},
    {
        contentComponent: props => <SideBar {...props} name={Firebase.auth().currentUser.displayName} photoUrl={Firebase.auth().currentUser.photoURL} />,
        drawerWidth: Dimensions.get("window").width * 0.80,
        hideStatusBar: true,
        contentOptions: {
            activeBackgroundColor: "#FDE8E2",
            activeTintColor: "#440733",
            itemContainerStyle: {
                marginTop: normalize(16),
                marginHorizontal: normalize(8),

            },
            itemStyle: {
                borderRadius: 4
            }
        }
    }
);

export default DrawerNavigator;

const styles = StyleSheet.create({
    label: {
        width: '100%',
        marginHorizontal: normalize(10),
        marginTop: normalize(15),
        fontFamily: "Roboto",
        height: '100%',
        padding: 8,
        fontSize: normalize(14)
    }
})