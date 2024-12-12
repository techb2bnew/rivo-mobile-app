import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import Header from '../components/Header';
import { blackColor, grayColor, mediumGray, whiteColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { BRONZE_IMAGE, GOLD_IMAGE, MANUAL_IMAGE, PROCESSING_ICON, SILVER_IMAGE, VIP_IMAGE } from '../assests/images';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { useFocusEffect } from '@react-navigation/native';
import { addNotification } from '../redux/actions';
const { flex, alignItemsCenter, alignItemsFlexStart, flexDirectionRow, textAlign, justifyContentCenter, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, alignJustifyCenter } = BaseStyle;

const TierScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const levels = [
    {
      id: "1",
      title: "Bronze",
      points: 2000,
      achieved: true,
      isInProgress: false,
      icon: BRONZE_IMAGE
    },
    {
      id: "2",
      title: "Silver",
      points: 4500,
      achieved: false,
      isInProgress: true,
      icon: SILVER_IMAGE
    },
    {
      id: "3",
      title: "Gold",
      points: 6000,
      achieved: false,
      isInProgress: false,
      icon: GOLD_IMAGE,
    },
    {
      id: "4",
      title: "Platinum",
      points: 15000,
      achieved: false,
      isInProgress: false,
      icon: VIP_IMAGE,
    },
  ];

  const reversedData = [...levels].reverse();

  const renderItem = ({ item, index }) => {
    // const isLastItem = index === levels.length - 1;
    // const nextItem = !isLastItem ? levels[index + 1] : null;
    // const isNextAchieved = nextItem ? nextItem.achieved : false;
    const isLastItem = index === reversedData.length - 1; // Using reversed data
    const isItemAchievedOrInProgress = item.achieved || item.isInProgress;
    const nextItem = !isLastItem ? reversedData[index + 1] : null;
    return (
      <View style={[styles.itemContainer, flexDirectionRow, alignItemsFlexStart]}>
        <View style={[styles.iconContainer, alignItemsCenter]}>
          <View style={[styles.iconWrapper, alignJustifyCenter, { borderColor: item.achieved === true ? blackColor : mediumGray }]}>
            <Image source={item.icon} style={[styles.icon, resizeModeContain]} />
          </View>
          {!isLastItem && (
            <View
              style={[
                styles.line,
                // Show solid line for items above or part of progress
                isItemAchievedOrInProgress
                  ? { borderColor: blackColor, borderStyle: 'solid' }
                  : { borderColor: grayColor, borderStyle: 'dashed' },
              ]}
            />
          )}
        </View>
        <View style={{ width: wp(60) }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>
            After collecting {item.points} points
          </Text>
        </View>
        <View style={[flex, alignJustifyCenter]}>
          {item.achieved && (
            <View style={styles.statusIcon}>
              <MaterialIcons name="check-circle" size={22} color="green" />
            </View>
          )}
          {item.isInProgress && (
            <View style={styles.statusIcon}>
              {/* <MaterialIcons name="sync" size={23} color="gray" /> */}
              <Image source={PROCESSING_ICON} style={{ resizeMode: "contain", width: 17, height: 17 }} />
            </View>
          )}
        </View>
      </View>
    );
  };

  const fetchNotifications = () => {
    PushNotification.getDeliveredNotifications((deliveredNotifications) => {
      deliveredNotifications.forEach((notification) => {
        dispatch(addNotification({
          identifier: notification.identifier,
          title: notification.title,
          body: notification.body,
        }));
      });
    });
  };

  const listenForPushNotifications = () => {
    messaging().onMessage(async (remoteMessage) => {
      // Check if notification is not already added by checking the identifier
      dispatch(addNotification({
        identifier: remoteMessage.messageId,
        title: remoteMessage.notification?.title || 'No Title',
        body: remoteMessage.notification?.body || 'No Body',
      }));
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      listenForPushNotifications();
    }, [])
  );


  return (
    <View style={[styles.container, flex]}>
      <Header navigation={navigation} />
      <View style={styles.separator} />
      <FlatList
        data={reversedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  itemContainer: {
    // marginBottom: 14,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconWrapper: {
    width: wp(18),
    height: wp(18),
    borderRadius: 50,
    backgroundColor: whiteColor,
    borderWidth: 1
  },
  icon: {
    width: wp(15),
    height: hp(4),
  },
  title: {
    fontSize: style.fontSizeNormal2x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    color: blackColor,
    marginBottom: spacings.small2x,
  },
  subtitle: {
    fontSize: style.fontSizeNormal.fontSize,
    color: grayColor,
  },
  separator: {
    width: wp(100),
    height: 1,
    backgroundColor: "#d9d9d9",
    marginBottom: spacings.large,
  },
  line: {
    width: 1.5,
    height: hp(4),
    borderWidth: 1,
  },
});

export default TierScreen;
