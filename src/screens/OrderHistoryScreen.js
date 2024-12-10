import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Platform, Pressable } from 'react-native';
import Header from '../components/Header';
import { blackColor, goldColor, grayColor, mediumGray, whiteColor, greenColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { ALL_ORDERS } from '../constants/Constants';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import getRealm from '../schemas/schemas';

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
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState(orderdata);
  const [ordersData, setOrdersData] = useState(orderdata);

  // const saveOrderToRealm = (orderData) => {
  //   const realm = getRealm();
  //   try {
  //     realm.write(() => {
  //       orderData.forEach((order) => {
  //         realm.create('Order', {
  //           id: order.id,
  //           points: order.points,
  //           date: order.date,
  //           time: order.time,
  //           status: order.status,
  //           location: order.location,
  //           store: order.store,
  //           deliveryMethod: order.deliveryMethod,
  //           subtotal: order.subtotal,
  //           shipping: order.shipping,
  //           items: order.items.map((item) => ({
  //             id: item.id,
  //             name: item.name,
  //             price: item.price,
  //             quantity: item.quantity,
  //             image: item.image,
  //           })),
  //         });
  //       });
  //     });
  //     console.log('Orders saved successfully!');
  //   } catch (error) {
  //     console.error('Error saving order to Realm:', error);
  //   }
  // };

  const saveOrderToRealm = (orderData) => {
    const realm = getRealm();

    const convertToNumber = (value) => {
      // Remove the dollar sign and any non-numeric characters
      const cleanedValue = value.replace(/[^\d.-]/g, '');
      const numericValue = parseFloat(cleanedValue);

      return isNaN(numericValue) ? 0 : numericValue; // If conversion fails, return 0
    };

    try {
      realm.write(() => {
        orderData.forEach((order) => {
          // Check if the order already exists in Realm
          const existingOrder = realm.objectForPrimaryKey('Order', order.id);

          if (!existingOrder) {
            realm.create('Order', {
              id: order.id,
              points: Number(order.points),  // Convert points to number
              date: order.date,
              time: order.time,
              status: order.status,
              location: order.location,
              store: order.store,
              deliveryMethod: order.deliveryMethod,
              subtotal: convertToNumber(order.subtotal), // Convert subtotal to number
              shipping: convertToNumber(order.shipping), // Convert shipping to number
              items: order.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: convertToNumber(item.price), // Convert item price to number
                quantity: Number(item.quantity), // Ensure quantity is a number
                image: item.image,
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


  useEffect(() => {
    if (orders?.length) {
      saveOrderToRealm(orders);
    }
    const loadOrders = () => {
      const ordersFromRealm = fetchOrdersFromRealm();
      setOrdersData(ordersFromRealm.reverse());
    };

    loadOrders();
  }, [orders]);

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
          id: '124555', // Ensure all new IDs are unique
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

      // Merge new data with existing orders, ensuring no duplicates
      const mergedData = [
        ...newData.filter(
          (newItem) => !orders.some((existingItem) => existingItem.id === newItem.id)
        ),
        ...orders

      ];

      setOrders(mergedData);
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

  const fetchOrdersFromRealm = () => {
    const realm = getRealm();
    try {
      const orders = realm.objects('Order');
      console.log('Fetched orders:', orders);
      return Array.from(orders);
    } catch (error) {
      console.error('Error fetching orders from Realm:', error);
      return [];
    }
  };


  return (
    <View style={[styles.container, flex]}>
      <Header navigation={navigation} />
      <View style={styles.separator} />
      <View style={{ height: Platform.OS === "android" ? hp(88) : hp(78) }}>
        <Text style={[styles.title, { padding: spacings.large }]}>{ALL_ORDERS}</Text>
        <FlatList
          data={ordersData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#42A5F5"]}
              tintColor="#42A5F5"
            />
          }
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
