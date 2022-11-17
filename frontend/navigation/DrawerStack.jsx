import React, { useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from "./CustomDrawer";
import { useSelector } from 'react-redux';
import UserScreen from "../screens/UserScreen";
import VanScreen from "../screens/VanScreen";

export function DrawerStack() {
  const user = useSelector((state) => state?.user);
  const Drawer = createDrawerNavigator();
  const navigationRef = useRef(null);

  return (
    <NavigationContainer
      ref={navigationRef}
    >
      {user?.userProfile.type == 2 ?
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={CustomDrawer}
          screenOptions={{
          activeTintColor: '#000000',
          activeBackgroundColor: '#e6e6e6',
          }}
          drawerType='slide'
          edgeWidth={30}
        >
          <Drawer.Screen name="Home" component={UserScreen} />
        </Drawer.Navigator> :
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={CustomDrawer}
        >
          <Drawer.Screen name="Home" component={VanScreen} />
        </Drawer.Navigator>}
    </NavigationContainer>
  );

}
