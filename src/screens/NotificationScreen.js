import { FlatList, Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { blackColor, grayColor, lightGrayColor, mediumGray, whiteColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { NOTIFICATIOS } from '../constants/Constants';
import PushNotification from 'react-native-push-notification';
import { APP_LOGO, NO_NOTIFICTION_IMG } from '../assests/images';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import messaging from '@react-native-firebase/messaging';
import { useDispatch, useSelector } from 'react-redux';
import { resetNotificationCount } from '../redux/actions';

const { flex, flexDirectionRow } = BaseStyle;

const NotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications); // Update with the correct path to your state

  useEffect(() => {
    dispatch(resetNotificationCount());
  }, [dispatch]);

  

  const renderNotification = ({ item }) => (
    <Swipeable
    >
      <View style={styles.notificationItemContainer}>
        <View style={styles.notificationImageWrapper}>
          <Image
            source={APP_LOGO}
            style={styles.notificationImage}
          />
        </View>
        <View style={styles.notificationTextWrapper}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.body}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={[styles.container, flex]}>
      <View style={[{ width: wp(100), height: "auto", padding: spacings.large,alignItems:"center" }, flexDirectionRow]}>
        <Pressable onPress={() => { navigation.goBack() }} style={[{ width: wp(10) }]}>
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
  notificationItem: {
    padding: 16,
    // marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    borderColor: "#d9d9d9",
    borderWidth: .5,
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
    backgroundColor: lightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    height: hp(12)
  },
  notificationItemContainer: {
    flexDirection: 'row',
    backgroundColor: whiteColor,
    borderRadius: 12,
    margin: 5, // Reduced from 12 to 6
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    padding: 10,
    alignItems: 'center',
    height:hp(13),
    width:"98%"
  },
  notificationList: {
    paddingHorizontal: spacings.large,
    paddingBottom: spacings.medium,
    paddingTop: spacings.small, 
  },
  notificationImageWrapper: {
    width: wp(16),
    height: hp(8),
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: spacings.medium,
  },
  notificationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  notificationTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: blackColor,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: grayColor,
    lineHeight: 18,
  },

});