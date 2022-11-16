import React, { useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/login_register/LoginScreen";
import RegisterUserScreen from "../screens/login_register/RegisterUser";

export function OnboardingStack() {
  const RootStackNav = createStackNavigator();
  const navigationRef = useRef(null);

  return (
    <NavigationContainer
      ref={navigationRef} >
      <RootStackNav.Navigator >

        <RootStackNav.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />

        <RootStackNav.Screen
          name="RegisterUser"
          options={{ headerShown: false }}
          component={RegisterUserScreen}
        />

      </RootStackNav.Navigator>
    </NavigationContainer>
  );
}
