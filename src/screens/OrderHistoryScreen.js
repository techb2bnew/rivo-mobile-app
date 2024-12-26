import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Platform, Pressable } from 'react-native';
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

const { flex, alignItemsCenter, alignItemsFlexStart, flexDirectionRow, textAlign, justifyContentSpaceBetween, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, alignJustifyCenter } = BaseStyle;

const orderdata = [
  {
    id: '12456',
    points: 500,
    date: ' Oct 20, 2024',
    time: '06:00 PM',
    status: 'Fulfilled',
    location: '#2748 bottlebrush',
    store: "online Store",
    deliveryMethod: "Economy",
    subtotal: "$48.00",
    shipping: "$4.00",
    items: [
      {
        id: 'uuid:5a780f5b-2435-4e43bb',
        name: 'Selling Plans Ski Wax',
        price: '$24.00',
        quantity: 1,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
      {
        id: 'uuid:5a780f5b-2435-4e43bb',
        name: 'Selling Plans Ski Wax',
        price: '$24.00',
        quantity: 1,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
      {
        id: 'uuid:5a780f5b-2435-4e43bb',
        name: 'Selling Plans Ski Wax',
        price: '$24.00',
        quantity: 1,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
    ],
  },
  {
    id: '12458',
    points: 400,
    date: ' Oct 23, 2024',
    time: '06:00 PM',
    status: 'Pending',
    location: '#2748 bottlebrush',
    store: "online Store",
    deliveryMethod: "Economy",
    subtotal: "$48.00",
    shipping: "$4.00",
    items: [
      {
        id: '2',
        name: 'Ski Wax Deluxe',
        price: '$34.00',
        quantity: 2,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
    ],
  },
  {
    id: '12459',
    points: 250,
    date: ' Oct 28, 2024',
    time: '06:14 PM',
    status: 'Fulfilled',
    location: '#2748 bottlebrush',
    store: "online Store",
    deliveryMethod: "Economy",
    subtotal: "$48.00",
    shipping: "$4.00",
    items: [
      {
        id: '2',
        name: 'Ski Wax Deluxe',
        price: '$34.00',
        quantity: 2,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
    ],
  },
  {
    id: '12460',
    points: 515,
    date: ' Nov 20, 2024',
    time: '06:10 PM',
    status: 'Pending',
    location: '#2748 bottlebrush',
    store: "online Store",
    deliveryMethod: "Economy",
    subtotal: "$48.00",
    shipping: "$4.00",
    items: [
      {
        id: '2',
        name: 'Ski Wax Deluxe',
        price: '$34.00',
        quantity: 2,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
    ],
  },
  {
    id: '12461',
    points: 50,
    date: ' Nov 22, 2024',
    time: '06:03 PM',
    status: 'Pending',
    location: '#2748 bottlebrush',
    store: "online Store",
    deliveryMethod: "Economy",
    subtotal: "$48.00",
    shipping: "$4.00",
    items: [
      {
        id: '2',
        name: 'Ski Wax Deluxe',
        price: '$34.00',
        quantity: 2,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
    ],
  },
  {
    id: '12462',
    points: 520,
    date: ' Nov 24, 2024',
    time: '06:10 PM',
    status: 'Fulfilled',
    location: '#2748 bottlebrush',
    store: "online Store",
    deliveryMethod: "Economy",
    subtotal: "$48.00",
    shipping: "",
    items: [
      {
        id: '2',
        name: 'Ski Wax Deluxe',
        price: '$34.00',
        quantity: 2,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
    ],
  },
  {
    id: '12463',
    points: 450,
    date: ' Nov 25, 2024',
    time: '06:00 AM',
    status: 'Fulfilled',
    location: '#2748 bottlebrush',
    store: "online Store",
    deliveryMethod: "Economy",
    subtotal: "$48.00",
    shipping: "$4.00",
    items: [
      {
        id: '2',
        name: 'Ski Wax Deluxe',
        price: '$34.00',
        quantity: 2,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
    ],
  },
  {
    id: '12464',
    points: 350,
    date: ' Nov 27, 2024',
    time: '03:00 PM',
    status: 'Fulfilled',
    location: '#2748 bottlebrush',
    store: "online Store",
    deliveryMethod: "Economy",
    subtotal: "$48.00",
    shipping: "$4.00",
    items: [
      {
        id: '2',
        name: 'Ski Wax Deluxe',
        price: '$34.00',
        quantity: 2,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
    ],
  },
  {
    id: '12465',
    points: 430,
    date: ' Nov 28, 2024',
    time: '06:00 PM',
    status: 'Fulfilled',
    location: '#2748 bottlebrush',
    store: "online Store",
    deliveryMethod: "Economy",
    subtotal: "$48.00",
    shipping: "$4.00",
    items: [
      {
        id: '2',
        name: 'Ski Wax Deluxe',
        price: '$34.00',
        quantity: 2,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
    ],
  },
  {
    id: '12466',
    points: 430,
    date: ' Nov 29, 2024',
    time: '06:00 PM',
    status: 'Pending',
    location: '#2748 bottlebrush',
    store: "online Store",
    deliveryMethod: "Economy",
    subtotal: "$48.00",
    shipping: "",
    items: [
      {
        id: '2',
        name: 'Ski Wax Deluxe',
        price: '$34.00',
        quantity: 2,
        image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
      },
    ],
  },
];

const OrderHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(false);

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

      const from_date = "2023-12-1";
      const to_date = "2024-12-15";

      const response = await fetch(
        `https://publicapi.dev.saasintegrator.online/api/orders?page=1&per_page=25&from_date=${from_date}&to_date=${to_date}`,
        { method: "GET", headers: myHeaders }
      );

      const result = await response.json();
      // console.log("result.data.data", result.data.data);

      if (result.data.data && result.data.data.length > 0) {
        saveOrderToRealm(result.data.data);
        fetchOrdersFromRealm();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      setLoading(false);
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
          const existingOrder = realm.objectForPrimaryKey('Order', order.id);
          if (!existingOrder) {
            realm.create('Order', {
              id: order.id,
              points: Math.floor(convertToNumber(order.grand_total)),
              date: order.created_at,
              status: order.status,
              items: order.order_items.map((item) => ({
                id: item.id,
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
      dispatch(saveOrderLength(orders.length));
    } catch (error) {
      console.error('Error fetching orders from Realm:', error);
    }
  };

  const onRefresh = async () => {
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

      const from_date = "2024-12-15";
      const to_date = today;

      const response = await fetch(
        `https://publicapi.dev.saasintegrator.online/api/orders?page=1&per_page=25&from_date=${from_date}&to_date=${to_date}`,
        { method: "GET", headers: myHeaders }
      );

      const result = await response.json();
      console.log("Fetched orders from API:", result.data.data);

      if (result.data.data && result.data.data.length > 0) {
        // Save the new orders to Realm
        saveOrderToRealm(result.data.data);

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

  useEffect(() => {
    initializeOrders();
  }, []);

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
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`; // 24-hour format
    };

    const formattedDate = formatDate(item.date);
    const formattedTime = formatTime(item.date);

    return (
      <Pressable
        style={styles.orderContainer}
        onPress={() => navigation.navigate('OrderDetails', { order: item })}
      >
        <View style={[flexDirectionRow, justifyContentSpaceBetween, alignItemsCenter]}>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text
            style={[
              styles.status,
              { color: item.status === "Pending" ? goldColor : greenColor }
            ]}
          >
            {item.status}
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
              RP - {item.points} |
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

  return (
    <View style={[styles.container, flex]}>
      <Header navigation={navigation} />
      <View style={styles.separator} />
      <View style={{ height: Platform.OS === "android" ? hp(88) : hp(78) }}>
        <Text style={[styles.title, { padding: spacings.large }]}>{ALL_ORDERS}</Text>
        <FlatList
          data={ordersData}
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
        {loading && (
          <LoaderModal visible={loading} message="Please wait..." />
        )}
      </View>
    </View>
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

});

export default OrderHistoryScreen;
