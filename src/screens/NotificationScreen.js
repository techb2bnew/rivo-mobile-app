import { FlatList, Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { blackColor, grayColor, mediumGray, whiteColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { NOTIFICATIOS } from '../constants/Constants';
import PushNotification from 'react-native-push-notification';
import { NO_NOTIFICTION_IMG } from '../assests/images';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from 'react-redux';
import { resetNotificationCount } from '../redux/actions';

const { flex, flexDirectionRow } = BaseStyle;

const NotificationScreen = ({ navigation }) => {
  // const notifications = [
  //   { id: '1', title: '30% Special Discount!', description: 'Special promotion only valid today.' },
  //   { id: '2', title: 'Top Up E-wallet Successfully!', description: 'You have top up your e-wallet.' },
  //   { id: '3', title: 'New Service Available!', description: 'Now you can track order in real-time.' },
  //   { id: '4', title: 'Credit Card Connected!', description: 'Credit card has been linked.' },
  //   { id: '5', title: 'Account Setup Successfully!', description: 'Your account has been created.' },
  // ];
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = () => {
    PushNotification.getDeliveredNotifications((deliveredNotifications) => {
      // console.log('Delivered Notifications:', deliveredNotifications);
      setNotifications(deliveredNotifications);
    });
  };

  const listenForPushNotifications = () => {
    messaging().onMessage(async (remoteMessage) => {
      // console.log('Push Notification Received:', remoteMessage);
      setNotifications(remoteMessage);
    });
  };
  
  useEffect(() => {
    fetchNotifications();
    listenForPushNotifications();
  }, []);

  useEffect(() => {
    dispatch(resetNotificationCount());
  }, [dispatch]);

  const removeNotification = (id) => {
    PushNotification.removeDeliveredNotifications([id]);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.identifier !== id)
    );
  };

  const renderNotification = ({ item }) => (
    <Swipeable
      onSwipeableRightOpen={() => removeNotification(item.identifier)}
      renderRightActions={() => (
        <View style={styles.swipeAction}>
          <Icon name="close" size={24} color={blackColor} />
        </View>
      )}
    >
      <View style={[styles.notificationItem, { backgroundColor: whiteColor, flexDirection: "row" }]}>
        <View style={{ width: wp(16), height: hp(8) }}>
          <Image source={NO_NOTIFICTION_IMG} style={{ width: "100%", height: "100%", resizeMode: "cover", borderRadius: 10 }} />
        </View>
        <View style={{ width: "90%", paddingLeft: spacings.large, height: "100%" }}>
          <Text style={[styles.notificationTitle, { color: blackColor }]}>{item.title }</Text>
          <Text style={[styles.notificationMessage, { color: blackColor }]}>{item.body}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={[styles.container, flex]}>
      <View style={[{ width: wp(100), height: "auto", padding: spacings.large }, flexDirectionRow]}>
        <Pressable onPress={() => { navigation.goBack(); }}>
          <Ionicons name="arrow-back" size={30} color={blackColor} />
        </Pressable>
        <Text style={styles.headerText}>
          {NOTIFICATIOS}
        </Text>
      </View>

      {notifications.length > 0 ? (<FlatList
        data={notifications}
        renderItem={renderNotification}
        // keyExtractor={(item) => item.id}
        keyExtractor={(item) => item?.identifier}
        contentContainerStyle={styles.notificationList}
      />) : (
        <View style={{ alignItems: "center", justifyContent: "center", height: "90%" }}>
          <Image source={NO_NOTIFICTION_IMG} style={{ width: wp(20), height: hp(12), resizeMode: "contain" }} />
          <Text style={[styles.notificationTitle, { color: blackColor }]}>No notifications available.</Text>
          <Text style={[styles.notificationDescription, { color: blackColor, marginTop: 8 }]}>
            You will see your notifications here once available.
          </Text>
        </View>
      )}
    </GestureHandlerRootView>
  )
}

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
  },
  headerText: {
    fontSize: style.fontSizeNormal2x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    color: blackColor,
    paddingHorizontal: spacings.large,
    paddingVertical: spacings.small
  },
  notificationList: {
    paddingHorizontal: spacings.large,
    paddingBottom: spacings.medium,
  },
  notificationItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    borderColor: "#d9d9d9",
    borderWidth: .5,
  },
  notificationTitle: {
    fontSize: style.fontSizeNormal2x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    color: blackColor,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: style.fontSizeNormal.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: mediumGray,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#d9d9d9",
    marginBottom: spacings.large,
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
    width: wp(10),
    height: '100%',
    borderRadius: 8,
  },

});