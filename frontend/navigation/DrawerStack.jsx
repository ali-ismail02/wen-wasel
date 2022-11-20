import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Appearance } from 'react-native';
import { useSelector } from 'react-redux';
import EditProfileScreen from "../screens/EditProfile";
import UserScreen from "../screens/UserScreen";
import VanScreen from "../screens/VanScreen";
import CustomDrawer from "./CustomDrawer";

export function DrawerStack() {
  const user = useSelector((state) => state?.user);
  const Drawer = createDrawerNavigator();
  const navigationRef = useRef(null);
  const [color, setColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener(({ colorScheme }) => {
    setColorScheme(colorScheme);
  });

  useEffect(() => {
    { colorScheme == 'dark' ? setColor('#fff') : setColor('#1E1E1E') }
    { colorScheme == 'dark' ? setBackgroundColor('#1E1E1E') : setBackgroundColor('#fff') }
  }, [colorScheme]);

  return (
    <NavigationContainer
      ref={navigationRef}
    >
      {user?.userProfile.type == 2 ?
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={CustomDrawer}
          screenOptions={{
            headerTintColor: color,
            activeTintColor: '#fff',
            activeBackgroundColor: '#e6e6e6',
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerTitleStyle: {
              color: color,
            },
          }}
          op
          drawerType='slide'
          edgeWidth={30}
        >
          <Drawer.Screen name="Home" component={UserScreen} />
          <Drawer.Screen name="My Profile" component={EditProfileScreen} />
        </Drawer.Navigator> :
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={CustomDrawer}
          screenOptions={{
            headerTintColor: color,
            activeTintColor: '#000000',
            activeBackgroundColor: '#e6e6e6',
            headerStyle: {
              backgroundColor: backgroundColor,
            },
            headerTitleStyle: {
              color: color,
            },

          }}
          drawerType='slide'
          edgeWidth={30}
        >
          <Drawer.Screen name="Home" component={VanScreen} />
          <Drawer.Screen name="My Profile" component={EditProfileScreen} />
        </Drawer.Navigator>}
    </NavigationContainer>
  );

}
