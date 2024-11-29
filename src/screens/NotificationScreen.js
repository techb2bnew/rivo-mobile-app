import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { blackColor, grayColor, mediumGray, whiteColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const { flex, flexDirectionRow } = BaseStyle;

const NotificationScreen = ({ navigation }) => {
  const notifications = [
    { id: '1', title: '30% Special Discount!', description: 'Special promotion only valid today.' },
    { id: '2', title: 'Top Up E-wallet Successfully!', description: 'You have top up your e-wallet.' },
    { id: '3', title: 'New Service Available!', description: 'Now you can track order in real-time.' },
    { id: '4', title: 'Credit Card Connected!', description: 'Credit card has been linked.' },
    { id: '5', title: 'Account Setup Successfully!', description: 'Your account has been created.' },
  ];

  const renderItem = ({ item }) => (
    <>
      <View style={styles.notificationItem}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
      </View>
      <View style={styles.separator} />
    </>
  );


  return (
    <View style={[styles.container, flex]}>
      <View style={[{ width: wp(100), height: "auto", padding: spacings.large }, flexDirectionRow]}>
        <Pressable onPress={() => { navigation.goBack(); }}>
          <Ionicons name="arrow-back" size={30} color={blackColor} />
        </Pressable>
        <Text style={styles.headerText}>
          Notifications
        </Text>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.notificationList}
      />
    </View>
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
    backgroundColor: whiteColor,
    padding: spacings.large,
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

});