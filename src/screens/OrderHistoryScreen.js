import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Platform, Pressable, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import { blackColor, goldColor, grayColor, mediumGray, whiteColor, greenColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { ALL_ORDERS } from '../constants/Constants';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import getRealm from '../schemas/schemas';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { triggerLocalNotification } from '../notificationService';
import { useFocusEffect } from '@react-navigation/native';
import { addNotification } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderModal from '../components/modals/LoaderModal';
import { saveOrderLength } from '../redux/orders/orderAction';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';


const { flex, alignItemsCenter, alignItemsFlexStart, flexDirectionRow, textAlign, justifyContentSpaceBetween, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, alignJustifyCenter } = BaseStyle;

const OrderHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [ordersData, setOrdersData] = useState([]);
  const [ordersFromLocalStorage, setOrdersFromLocalStorage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setpage] = useState(1);

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
  const listenForForegroundPushNotifications = () => {
    messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground Push Notification:', remoteMessage);

      // Check if notification is not already added
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
      listenForForegroundPushNotifications();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      fetchOrdersFromLocalStorage();
    }, [])
  );

  const fetchOrdersFromAPI = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No authentication token found');
        return;
      }
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Accept", "application/json");

      const from_date = "";
      const to_date = "";

      const response = await fetch(
        `https://publicapi.dev.saasintegrator.online/api/orders?page=${page}&per_page=30&from_date=${from_date}&to_date=${to_date}`,
        { method: "GET", headers: myHeaders }
      );

      const result = await response.json();
      console.log("result.data.data", result.data);

      if (result.data.orders && result.data.orders.length > 0) {
        if (Platform.OS === "android") {
          await AsyncStorage.setItem("LocalorderData", JSON.stringify(result.data.orders))
        }
        if (Platform.OS === "ios") {
          saveOrderToRealm(result.data.orders);
          fetchOrdersFromRealm();
        } else {
          fetchOrdersFromLocalStorage();
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching orders from api:", error.message);
      setLoading(false);
    } finally {
      setLoading(false); // Ensure loading is false in all cases
    }
  };

  const saveOrderToRealm = (orderData) => {
    const realm = getRealm();

    const convertToNumber = (value) => {
      const cleanedValue = value.replace(/[^\d.-]/g, '');
      const numericValue = parseFloat(cleanedValue);

      return isNaN(numericValue) ? 0 : numericValue;
    };

    try {
      realm.write(() => {
        orderData.forEach((order) => {
          const existingOrder = realm.objectForPrimaryKey('Order', order.uid);
          if (!existingOrder) {
            realm.create('Order', {
              id: order.uid,
              points: Math.floor(convertToNumber(order.grand_total)),
              date: order.created_at,
              status: order.status,
              items: order.order_items.map((item) => ({
                id: item.id,
                order_id: item.order_id,
                name: item.product?.name || 'Unknown Product',
                price: convertToNumber(item.price),
                quantity: Math.floor(convertToNumber(item.quantity_ordered)),
                product: {
                  id: item.product?.id || 'Unknown Product',
                  name: item.product?.name || 'Unknown Product',
                  sku: item.product?.sku || 'Unknown Product',
                  product_type: item.product?.product_type || 'Unknown Product',
                  slug: item.product?.slug || 'Unknown Product',
                  uid: item.product?.uid || 'Unknown Product',
                }
              })),
            });
          } else {
            console.log(`Order with ID ${order.id} already exists, skipping.`);
          }
        });
      });
      console.log('Orders processed successfully!');
    } catch (error) {
      console.error('Error saving order to Realm:', error);
    }
  };

  const fetchOrdersFromRealm = () => {
    const realm = getRealm();
    try {
      const orders = realm.objects('Order');
      // console.log('Fetched orders from Realm:', orders);
      setOrdersData(Array.from(orders).reverse());
      dispatch(saveOrderLength(orders?.length));
    } catch (error) {
      console.error('Error fetching orders from Realm:', error);
    }
  };

  const onRefresh = async () => {
    setpage(page + 1);
    setRefreshing(true);

    try {
      // Fetch today's date in the required format (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];

      // Fetch orders from the API with updated dates
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No authentication token found');
        setRefreshing(false);
        return;
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Accept", "application/json");

      const from_date = "";
      const to_date = "";

      const response = await fetch(
        `https://publicapi.dev.saasintegrator.online/api/orders?page=${page}&per_page=30&from_date=${from_date}&to_date=${to_date}`,
        { method: "GET", headers: myHeaders }
      );

      const result = await response.json();
      console.log("Fetched orders from API:", result.data);

      if (result.data.orders && result.data.orders.length > 0) {
        // Save the new orders to Realm
        saveOrderToRealm(result.data.orders);

        // Fetch all orders from Realm (including the new ones)
        fetchOrdersFromRealm();
      }
    } catch (error) {
      console.error("Error fetching orders on refresh:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const initializeOrders = async () => {
    const isFirstInstall = await AsyncStorage.getItem('hasFetchedOrders');
    if (!isFirstInstall) {
      await fetchOrdersFromAPI();
      await AsyncStorage.setItem('hasFetchedOrders', 'true');
    } else {
      fetchOrdersFromRealm(); // Fetch from Realm if already initialized
    }
  };

  const fetchOrdersFromLocalStorage = async () => {
    try {
      const localData = await AsyncStorage.getItem('LocalorderData');
      // console.log("localData", localData);
      const parsedData = JSON.parse(localData);
      setOrdersFromLocalStorage(parsedData?.reverse());
    } catch (error) {
      console.error("Error fetching orders from local storage:", error.message);
    }
  };

  useEffect(() => {
    initializeOrders();
  }, []);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const renderOrderItem = ({ item }) => {
    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      const day = date.getDate().toString().padStart(2, '0'); // Two-digit day
      const month = date.toLocaleString("en-US", { month: "short" }); // Short month name
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    };

    // Function to format the time
    const formatTime = (isoDate) => {
      const date = new Date(isoDate);
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const amPm = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM
      hours = hours % 12 || 12; // Convert to 12-hour format, ensuring 12 for 0 hours
      return `${hours}:${minutes} ${amPm}`; // 12-hour format with AM/PM
    };

    const formattedDate = formatDate(item.date ?? item.created_at);
    const formattedTime = formatTime(item.date ?? item.created_at);

    return (
      <Pressable
        style={styles.orderContainer}
        onPress={() => navigation.navigate('OrderDetails', { connectionId: item?.order_items?.[0]?.order_id ?? item.items[0].order_id })}
      >
        <View style={[flexDirectionRow, justifyContentSpaceBetween, alignItemsCenter]}>
          <Text style={styles.orderId}>Order {item.uid ?? item.id}</Text>
          <Text
            style={[
              styles.status,
              { color: item.status === "Pending" ? goldColor : greenColor }
            ]}
          >
            {capitalizeWords(item.status)}
          </Text>
        </View>
        <View
          style={[
            flexDirectionRow,
            justifyContentSpaceBetween,
            alignItemsCenter,
            { width: wp(93) }
          ]}
        >
          <View style={[{ width: wp(50) }, flexDirectionRow]}>
            <Text style={[styles.details, { color: blackColor, fontWeight: style.fontWeightThin1x.fontWeight }]}>
              RP - {item.grand_total ?? item.points} |
            </Text>
            <Text style={[styles.details]}>
              {formattedDate} at {formattedTime}
            </Text>
          </View>
          <Text style={styles.expandIcon}>
            <Entypo name="chevron-right" size={20} color={blackColor} />
          </Text>
        </View>
      </Pressable>
    );
  };

  const OrderItemLoader = () => {
    return (
      <ContentLoader
        speed={1.2}
        width={wp(100)} // Full width of the container
        height={100}
        viewBox="0 0 300 100"
        backgroundColor="#f0f0f0"
        foregroundColor={grayColor}
      >
        {/* Skeleton for the Order ID */}
        <Rect x="0" y="10" rx="4" ry="4" width="100" height="20" />

        {/* Skeleton for the Status */}
        <Rect x="220" y="10" rx="4" ry="4" width="100" height="20" />

        {/* Skeleton for the Details */}
        <Rect x="0" y="40" rx="4" ry="4" width="220" height="20" />

        {/* Skeleton for the Expand Icon */}
        <Circle cx="290" cy="50" r="10" />
      </ContentLoader>
    );
  };

  useEffect(() => {
    console.log("loading", loading)
  }, [loading])


  return (
    <View style={[styles.container, flex]}>
      <Header navigation={navigation} />
      <View style={styles.separator} />
      <View style={[{ height: Platform.OS === "android" ? hp(88) : hp(78), width: wp(100) }]}>
        {/* {loading ? (
          <View>
            {new Array(4).fill(null).map((_, index) => (
              <OrderItemLoader key={index} />
            ))}
          </View>
        ) : (
          <View>
            {(ordersData?.length > 0 || ordersFromLocalStorage?.length > 0) && (
              <Text style={[styles.title, { padding: spacings.large }]}>{ALL_ORDERS}</Text>
            )}
            <FlatList
              data={ordersData.length > 0 ? ordersData : ordersFromLocalStorage}
              renderItem={renderOrderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item?.id?.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#42A5F5"]}
                  tintColor="#42A5F5"
                />
              }
            />

          </View>)} */}
        {loading && (
          <View>
            {new Array(4).fill(null).map((_, index) => (
              <OrderItemLoader key={index} />
            ))}
          </View>
        )}
        {!loading && (
          <View style={{ marginBottom: hp(5) }}>
            {(ordersData?.length > 0 || ordersFromLocalStorage?.length > 0) && (
              <Text style={[styles.title, { padding: spacings.large }]}>{ALL_ORDERS}</Text>
            )}
            <FlatList
              data={ordersData.length > 0 ? ordersData : ordersFromLocalStorage}
              renderItem={renderOrderItem}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item?.id?.toString()}
              ListEmptyComponent={
                <View style={{ width: wp(100), height: hp(50), justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                  <Text style={{ color: "#646E77", fontSize: 16, fontWeight: "bold" }}>
                    No orders yet!
                  </Text>
                  <Text style={{ color: "#808080", fontSize: 14, marginTop: 5 }}>
                    Your recent orders will appear here.
                  </Text>
                </View>
              }
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#42A5F5"]}
                  tintColor="#42A5F5"
                />
              }
              style={{ height: Platform.OS === "android" ? hp(81) : hp(72) }}
            />
          </View>
        )}
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
  },
  itemContainer: {
    marginBottom: 14,
  },
  title: {
    fontSize: style.fontSizeMedium1x.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: blackColor,
    marginBottom: spacings.small2x,
  },
  orderContainer: {
    backgroundColor: whiteColor,
    // borderRadius: 10,
    padding: spacings.large,
    borderBottomColor: "#d9d9d9",
    borderBottomWidth: 1

  },
  orderId: {
    fontSize: style.fontSizeNormal.fontSize,
    fontWeight: 'bold',
    color: blackColor,
    marginBottom: spacings.normal
  },
  status: {
    fontSize: style.fontSizeSmall2x.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
  },
  details: {
    fontSize: style.fontSizeSmall2x.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: grayColor,
  },
  expandIcon: {
    fontSize: style.fontSizeLarge.fontSize,
    color: mediumGray,
    textAlign: 'center',
  },
  itemsContainer: {
    marginTop: spacings.medium,
  },
  product: {
    marginBottom: spacings.medium,
  },
  productImage: {
    width: wp(15),
    height: wp(15),
    borderRadius: 8,
  },
  productName: {
    fontSize: style.fontSizeMedium.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: blackColor,
  },
  productDetails: {
    fontSize: style.fontSizeSmall2x.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: grayColor,
  },
  productPrice: {
    fontSize: style.fontSizeSmall2x.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: blackColor,
  },
  separator: {
    width: wp(100),
    height: 1,
    backgroundColor: "#d9d9d9",
    marginBottom: spacings.large,
  },
  noOrderText: {
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    color: blackColor, // or use any other color you prefer
    textAlign: 'center',
    paddingVertical: spacings.large,
  },

});

export default OrderHistoryScreen;
