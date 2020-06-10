import React from 'react';
import { StyleSheet, } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import DrawerNavigator from './components/DrawerNavigator';
import IntroPage from './components/IntroPage'
import Login from './components/Login'
import Signup from './components/Signup'
import ResetPassword from './components/ResetPassword'
import Loading from './components/Loading'
import ConfirmAccount from './components/ConfirmAccount';
import OtpVerification from './components/OtpVerification';
const LoadStack = createStackNavigator({
  Loading: {
    screen: Loading,
    navigationOptions: ({ navigation }) => ({
      headerShown: false
    }),
  },
  IntroPage: {
    screen: IntroPage,
    navigationOptions: ({ navigation }) => ({
      headerShown: false
    })
  }
}, {
  initialRouteParams: "Signin",
})
const AuthStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      headerShown: false
    }),
  },
  Signup: {
    screen: Signup,
    navigationOptions: ({ navigation }) => ({
      headerShown: false
    }),
  },
  ResetPassword: {
    screen: ResetPassword,
    navigationOptions: ({ navigation }) => ({
      headerShown: false
    }),
  },
  ConfirmAccount: {
    screen: ConfirmAccount,
    navigationOptions: ({ navigation }) => ({
      headerShown: false
    })
  },
  OtpVerification: {
    screen: OtpVerification,
    navigationOptions: ({ navigation }) => ({
      headerShown: false
    })
  }
}, {
  initialRouteParams: "Signin",
})
const AppStack = createStackNavigator({
  DrawerNavigator: {
    screen: DrawerNavigator,
    navigationOptions: {
      headerShown: false
    }
  }
})
export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: LoadStack,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteParams: 'AuthLoading',
  }
));
