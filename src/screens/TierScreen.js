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
import LoaderModal from '../components/modals/LoaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLUGGIN_ID } from '../constants/Constants';
const { flex, alignItemsCenter, alignItemsFlexStart, flexDirectionRow, textAlign, justifyContentCenter, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, alignJustifyCenter } = BaseStyle;

const TierScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const reversedData = [...levels].reverse();

  const fetchTiers = async () => {
    setLoading(true);
    try {
      // Retrieve token and current points from AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      const currentPoints = await AsyncStorage.getItem("currentPoints");

      if (!token) {
        console.warn("Token missing in AsyncStorage");
        setLoading(false);
        return;
      }

      if (!currentPoints) {
        console.warn("current points missing in AsyncStorage");
        setLoading(false);
        return;
      }

      // Prepare headers
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      // API URL and request options
      const url = `https://publicapi.dev.saasintegrator.online/api/vip-tiers?plugin_id=${PLUGGIN_ID}`;
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      // Fetch data from API
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      if (result.success) {
        const sortedTiers = result.data.sort((a, b) => a.threshold - b.threshold);
        let levels = [];

        sortedTiers.forEach((item, index) => {
          const achieved = currentPoints >= item.threshold;
          const isInProgress =
            currentPoints < item.threshold &&
            currentPoints >= (sortedTiers[index - 1]?.threshold || 0);

          levels.push({
            id: item.id.toString(),
            name: item.name,
            points: item.threshold,
            achieved,
            isInProgress,
            icon: getTierIcon(item.name, achieved),
          });
        });

        // Update state with levels array
        setLevels(levels);
        // console.log("Processed Levels:", levels);
      } else {
        console.error("Failed to fetch tiers:", result.message);
      }
    } catch (error) {
      console.error("Error fetching tiers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (name, achieved) => {
    switch (name.toLowerCase()) {
      case "bronze":
        return BRONZE_IMAGE;
      case "silver":
        return SILVER_IMAGE;
      case "gold":
        return GOLD_IMAGE;
      case "diamond":
        return VIP_IMAGE;
      case "Retailer":
        return VIP_IMAGE;
      case "wholesale":
        // return VIP_IMAGE;
        return achieved ? BRONZE_IMAGE : VIP_IMAGE;
      default:
        return BRONZE_IMAGE;
    }
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
      fetchTiers();
      fetchNotifications();
      listenForPushNotifications();
    }, [])
  );


  const renderItem = ({ item, index }) => {
    // console.log("item:::", item)
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
          <Text style={styles.title}>{item.name}</Text>
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

  return (
    <View style={[styles.container, flex]}>
      <Header navigation={navigation} />
      <View style={styles.separator} />
      {loading ? (
        <LoaderModal visible={loading} message="Loading tiers..." />
      ) : (<FlatList
        data={reversedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />)}
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
