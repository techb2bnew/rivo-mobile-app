import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Platform, Pressable } from 'react-native';
import Header from '../components/Header';
import { blackColor, goldColor, grayColor, mediumGray, whiteColor, greenColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { ALL_ORDERS } from '../constants/Constants';
import Entypo from 'react-native-vector-icons/dist/Entypo';
const { flex, alignItemsCenter, alignItemsFlexStart, flexDirectionRow, textAlign, justifyContentSpaceBetween, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, alignJustifyCenter } = BaseStyle;

const OrderHistoryScreen = ({ navigation }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([
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
  ]);

  // useEffect(() => {
  //   const fetchOrderHistory = async () => {
  //     try {
  //       // Check if the API has already been called before (using flag in AsyncStorage)
  //       const isFirstTime = await AsyncStorage.getItem('orderHistoryFetched');

  //       if (isFirstTime !== 'true') {
  //         // First time, hit the API to fetch data
  //         const response = await axios.get('YOUR_API_URL');
  //         setOrderHistory(response.data); // Store the fetched data in state

  //         // Store the data in AsyncStorage for future use
  //         await AsyncStorage.setItem('orderHistoryData', JSON.stringify(response.data));
  //         await AsyncStorage.setItem('orderHistoryFetched', 'true'); // Set the flag
  //       } else {
  //         // Not the first time, load data from AsyncStorage
  //         const cachedData = await AsyncStorage.getItem('orderHistoryData');
  //         if (cachedData) {
  //           setOrderHistory(JSON.parse(cachedData)); // Use cached data from AsyncStorage
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching order history:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrderHistory();
  // }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      const newData = [
        {
          id: '124533',
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
              id: '2',
              name: 'Ski Wax Deluxe',
              price: '$34.00',
              quantity: 2,
              image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
            },
          ],
        },
        {
          id: '124544',
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
              id: '2',
              name: 'Ski Wax Deluxe',
              price: '$34.00',
              quantity: 2,
              image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
            },
          ],
        },
        {
          id: '124555',
          points: 500,
          date: ' Oct 20, 2024',
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
      setOrders([...newData, ...orders]);
      setRefreshing(false);
    }, 2000);
  };

  const renderOrderItem = ({ item }) => (
    <Pressable style={styles.orderContainer} 
    onPress={() => { navigation.navigate('OrderDetails', { order: item }) }}
    >
      <View style={[flexDirectionRow, justifyContentSpaceBetween, alignItemsCenter]}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={[styles.status, { color: item.status === "Pending" ? goldColor : greenColor }]}>{item.status}</Text>
      </View>
      <View style={[flexDirectionRow, justifyContentSpaceBetween, alignItemsCenter, { width: wp(93) }]}>
        <View style={[{ width: wp(50) }, flexDirectionRow]}>
          <Text style={[styles.details, { color: blackColor, fontWeight: style.fontWeightThin1x.fontWeight }]}>
            RP - {item.points} |
          </Text>
          <Text style={[styles.details]}>
            {item.date} at {item.time}
          </Text>
        </View>
        <Text style={styles.expandIcon}>
          <Entypo name="chevron-right" size={20} color={blackColor} />
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, flex]}>
      <Header navigation={navigation} />
      <View style={styles.separator} />
      <View style={{ height: Platform.OS === "android" ? hp(88) : hp(78) }}>
        <Text style={[styles.title, { padding: spacings.large }]}>{ALL_ORDERS}</Text>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={onRefresh}
          //     colors={["#42A5F5"]} 
          //     tintColor="#42A5F5" 
          //   />
          // }
        />
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
    fontSize: style.fontSizeMedium.fontSize,
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
