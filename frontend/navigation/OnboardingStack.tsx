import React, { useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/login_register/LoginScreen";
import RegisterUserScreen from "../screens/login_register/RegisterUser";
import RegisterCarScreen from "../screens/login_register/RegisterCar";
import RegisterCarImagesScreen from "../screens/login_register/RegisterCarImages";
import RegisterLicenseScreen from "../screens/login_register/RegisterLicense";

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

        <RootStackNav.Screen
          name="RegisterCar"
          options={{ headerShown: false }}
          component={RegisterCarScreen}
        />

        <RootStackNav.Screen
          name="RegisterCarImages"
          options={{ headerShown: false }}
          component={RegisterCarImagesScreen}
        />

        <RootStackNav.Screen
          name="RegisterLicense"
          options={{ headerShown: false }}
          component={RegisterLicenseScreen}
        />

      </RootStackNav.Navigator>
    </NavigationContainer>
  );
}
