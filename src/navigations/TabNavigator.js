import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DASHBOARD_IMAGE, OFFER_IMAGE, ORDERS_IMAGE, PROFILE_IMAGE, TIER_IMAGE } from '../assests/images';
import { Image } from 'react-native';
import { blackColor } from '../constants/Color';
import DashboardStack from './DashBoardStack';
import OfferStack from './offerStack';
import TierStack from './TierStack';
import OrderStack from './OrderStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;
          if (route.name === 'Dashboard') {
            iconSource = DASHBOARD_IMAGE;
          } else if (route.name === 'Offers') {
            iconSource = OFFER_IMAGE;
          } else if (route.name === 'Tier') {
            iconSource = TIER_IMAGE;
          } else if (route.name === 'OrderHistory') {
            iconSource = ORDERS_IMAGE;
          } else if (route.name === 'Profile') {
            iconSource = PROFILE_IMAGE;
          }
          return (
            <Image
              source={iconSource}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? blackColor : 'gray',
                alignSelf: 'center',
                resizeMode:"contain"
              }}
            />
          );
        },
        tabBarLabel: () => null,
        tabBarStyle: {
          paddingBottom: 5, 
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack}  options={{ unmountOnBlur: true }}/>
      <Tab.Screen name="Offers" component={OfferStack}  options={{ unmountOnBlur: true }}/>
      <Tab.Screen name="Tier" component={TierStack}  options={{ unmountOnBlur: true }}/>
      <Tab.Screen name="OrderHistory" component={OrderStack}  options={{ unmountOnBlur: true }}/>
      <Tab.Screen name="Profile" component={ProfileStack}  options={{ unmountOnBlur: true }}/>
    </Tab.Navigator>
  );
};

export default TabNavigator;
