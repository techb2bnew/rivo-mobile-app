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
    // {
    //   id: '12457',
    //   points: 500,
    //   date: ' Oct 20, 2024',
    //   time: '06:00 PM',
    //   status: 'Pending',
    //   location: '#2748 bottlebrush',
    //   store: "online Store",
    //   deliveryMethod: "Economy",
    //   subtotal: "$48.00",
    //   shipping: "$4.00",
    //   items: [
    //     {
    //       id: '2',
    //       name: 'Ski Wax Deluxe',
    //       price: '$34.00',
    //       quantity: 2,
    //       image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
    //     },
    //   ],
    // },
    // {
    //   id: '12457',
    //   points: 500,
    //   date: ' Oct 20, 2024',
    //   time: '06:00 PM',
    //   status: 'Fulfilled',
    //   location: '#2748 bottlebrush',
    //   store: "online Store",
    //   deliveryMethod: "Economy",
    //   subtotal: "$48.00",
    //   shipping: "$4.00",
    //   items: [
    //     {
    //       id: '2',
    //       name: 'Ski Wax Deluxe',
    //       price: '$34.00',
    //       quantity: 2,
    //       image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
    //     },
    //   ],
    // },
    // {
    //   id: '12457',
    //   points: 500,
    //   date: ' Oct 20, 2024',
    //   time: '06:00 PM',
    //   status: 'Pending',
    //   location: '#2748 bottlebrush',
    //   store: "online Store",
    //   deliveryMethod: "Economy",
    //   subtotal: "$48.00",
    //   shipping: "$4.00",
    //   items: [
    //     {
    //       id: '2',
    //       name: 'Ski Wax Deluxe',
    //       price: '$34.00',
    //       quantity: 2,
    //       image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
    //     },
    //   ],
    // },
    // {
    //   id: '12457',
    //   points: 500,
    //   date: ' Oct 20, 2024',
    //   time: '06:00 PM',
    //   status: 'Pending',
    //   location: '#2748 bottlebrush',
    //   store: "online Store",
    //   deliveryMethod: "Economy",
    //   subtotal: "$48.00",
    //   shipping: "$4.00",
    //   items: [
    //     {
    //       id: '2',
    //       name: 'Ski Wax Deluxe',
    //       price: '$34.00',
    //       quantity: 2,
    //       image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
    //     },
    //   ],
    // },
    // {
    //   id: '12457',
    //   points: 500,
    //   date: ' Oct 20, 2024',
    //   time: '06:00 PM',
    //   status: 'Fulfilled',
    //   location: '#2748 bottlebrush',
    //   store: "online Store",
    //   deliveryMethod: "Economy",
    //   subtotal: "$48.00",
    //   shipping: "",
    //   items: [
    //     {
    //       id: '2',
    //       name: 'Ski Wax Deluxe',
    //       price: '$34.00',
    //       quantity: 2,
    //       image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
    //     },
    //   ],
    // },
    // {
    //   id: '12457',
    //   points: 500,
    //   date: ' Oct 20, 2024',
    //   time: '06:00 PM',
    //   status: 'Fulfilled',
    //   location: '#2748 bottlebrush',
    //   store: "online Store",
    //   deliveryMethod: "Economy",
    //   subtotal: "$48.00",
    //   shipping: "$4.00",
    //   items: [
    //     {
    //       id: '2',
    //       name: 'Ski Wax Deluxe',
    //       price: '$34.00',
    //       quantity: 2,
    //       image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
    //     },
    //   ],
    // },
    // {
    //   id: '12457',
    //   points: 500,
    //   date: ' Oct 20, 2024',
    //   time: '06:00 PM',
    //   status: 'Fulfilled',
    //   location: '#2748 bottlebrush',
    //   store: "online Store",
    //   deliveryMethod: "Economy",
    //   subtotal: "$48.00",
    //   shipping: "$4.00",
    //   items: [
    //     {
    //       id: '2',
    //       name: 'Ski Wax Deluxe',
    //       price: '$34.00',
    //       quantity: 2,
    //       image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
    //     },
    //   ],
    // },
    // {
    //   id: '12457',
    //   points: 500,
    //   date: ' Oct 20, 2024',
    //   time: '06:00 PM',
    //   status: 'Fulfilled',
    //   location: '#2748 bottlebrush',
    //   store: "online Store",
    //   deliveryMethod: "Economy",
    //   subtotal: "$48.00",
    //   shipping: "$4.00",
    //   items: [
    //     {
    //       id: '2',
    //       name: 'Ski Wax Deluxe',
    //       price: '$34.00',
    //       quantity: 2,
    //       image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
    //     },
    //   ],
    // },
    // {
    //   id: '12457',
    //   points: 500,
    //   date: ' Oct 20, 2024',
    //   time: '06:00 PM',
    //   status: 'Pending',
    //   location: '#2748 bottlebrush',
    //   store: "online Store",
    //   deliveryMethod: "Economy",
    //   subtotal: "$48.00",
    //   shipping: "",
    //   items: [
    //     {
    //       id: '2',
    //       name: 'Ski Wax Deluxe',
    //       price: '$34.00',
    //       quantity: 2,
    //       image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
    //     },
    //   ],
    // },
  ]);

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
    // onPress={() => { navigation.navigate('OrderDetails', { order: item }) }}
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
      {/* {expandedOrderId === item.id && (
        <View style={styles.itemsContainer}>
          {item.items.map((product) => (
            <View key={product.id} style={[flexDirectionRow, alignItemsCenter, styles.product]}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={{ flex: 1, marginLeft: spacings.medium }}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDetails}>
                  - {product.id}
                </Text>
                <Text style={[styles.productDetails, { color: blackColor, fontWeight: style.fontWeightThin1x.fontWeight }]}>
                  Qty: {product.quantity}
                </Text>
              </View>
              <Text style={styles.productPrice}>{product.price}</Text>
            </View>
          ))}
        </View>
      )} */}
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
