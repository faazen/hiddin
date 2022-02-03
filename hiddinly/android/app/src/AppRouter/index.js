import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "../screens/Splash";
import Signup from "../screens/signup";
import Signin from "../screens/signin";
import OTP from "../screens/otp";
import Fingerprint from "../screens/FingerprintScanner";
import QRCode from "../screens/QRCode";
import Home from "../screens/Home";
import OnetoOne from "../screens/ChatRoom/OnetoOne";
import GroupChat from "../screens/ChatRoom/GroupChat";
import Settings from "../screens/Settings";
import Profile from "../screens/Settings/Profile";
import Accounts from "../screens/Settings/Accounts";
import BlockedContacts from "../screens/Settings/Accounts/BlockedContacts";
import Notifications from "../screens/Settings/Notifications";
import NewGroup from "../screens/NewGroup";
import CreateGroup from "../screens/NewGroup/CreateGroup";

import { enableScreens } from "react-native-screens";

enableScreens();

const Stack = createStackNavigator();

function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none" initialRouteName="splash">
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="signup" component={Signup} />
        <Stack.Screen name="signin" component={Signin} />
        <Stack.Screen name="otp" component={OTP} />
        <Stack.Screen name="fingerprint" component={Fingerprint} />
        <Stack.Screen name="QRcode" component={QRCode} />
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="onetoone" component={OnetoOne} />
        <Stack.Screen name="groupchat" component={GroupChat} />
        <Stack.Screen name="settings" component={Settings} />
        <Stack.Screen name="profile" component={Profile} />
        <Stack.Screen name="accounts" component={Accounts} />
        <Stack.Screen name="blockedcontacts" component={BlockedContacts} />
        <Stack.Screen name="notifications" component={Notifications} />
        <Stack.Screen name="Newgroup" component={NewGroup} />
        <Stack.Screen name="creategroup" component={CreateGroup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Router;
