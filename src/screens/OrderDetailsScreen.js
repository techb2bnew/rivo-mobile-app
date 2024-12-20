import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { blackColor, grayColor, whiteColor, lightGrayColor } from '../constants/Color';
import { spacings, style } from '../constants/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import CustomButton from '../components/CustomButton';
import { BaseStyle } from '../constants/Style';
import { DELIVERY_METHOD, LOCATION, PRICE_DETAILS, SHIPPING, SUBTOTAL, TOTAL } from '../constants/Constants';
const { flex, alignItemsCenter, alignItemsFlexStart, flexDirectionRow, textAlign, justifyContentSpaceBetween, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, alignJustifyCenter } = BaseStyle;

const OrderDetailsScreen = ({ route, navigation }) => {
    const { order } = route.params;
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-GB');
    const formattedTime = orderDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    // console.log(order.items)
    return (
        <View style={[styles.container, flex]}>
            <View style={{ width: wp(100), height: "auto", padding: spacings.large }}>
                <Pressable onPress={() => { navigation.goBack(); }}>
                    <Ionicons name="arrow-back" size={30} color={blackColor} />
                </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Order ID: #{order.id}</Text>

                <Text style={styles.orderDate}>
                    {formattedDate} at {formattedTime}
                </Text>

                <View style={styles.separator} />
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>{"Status"}</Text>
                    <Text style={styles.infoText}>{order.status}</Text>
                </View>

                {/* <View style={styles.separator} />
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>{DELIVERY_METHOD}</Text>
                    <Text style={styles.infoText}>{order.deliveryMethod}</Text>
                </View> */}

                <View style={styles.separator} />
                {order.items.map((item) => (
                    <>
                        <View key={item.id} style={[styles.productContainer, flexDirectionRow, alignItemsCenter]}>
                            {/* <Image source={{ uri: item.image }} style={styles.productImage} /> */}
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>Name : {item.name}</Text>
                                <Text style={styles.productInfo}>id - {item.id}</Text>
                                <Text style={[styles.productInfo, { color: blackColor, fontWeight: style.fontWeightThin1x.fontWeight, marginTop: 2 }]}>Qty: {item.quantity}</Text>
                            </View>
                            <View style={{ height: "100%" }}>
                                <Text style={styles.productPrice}>${item.price}</Text>
                            </View>
                        </View>
                        <View style={styles.separator} />
                    </>
                ))}
                <View style={styles.priceDetails}>
                    <Text style={[styles.priceHeader, justifyContentSpaceBetween, flexDirectionRow]}>{PRICE_DETAILS} ({order.items.length} Items)</Text>

                    {order.items.map((item) => (
                        <>
                            <View style={[styles.priceRow, flexDirectionRow, justifyContentSpaceBetween]}>
                                <Text style={styles.priceLabel}>Price</Text>
                                <Text style={styles.priceValue}>${item.price}</Text>
                            </View>
                            <View style={[styles.priceRow, flexDirectionRow, justifyContentSpaceBetween]}>
                                <Text style={styles.priceLabel}>Quantity</Text>
                                <Text style={styles.priceValue}>{item.quantity}</Text>
                            </View>
                        </>
                    ))}
                    <View style={[styles.priceRow, flexDirectionRow, justifyContentSpaceBetween]}>
                        <Text style={styles.priceLabelTotal}>{TOTAL} Amount</Text>
                        <Text style={styles.priceValueTotal}>${order?.points}</Text>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: whiteColor,
    },
    scrollContainer: {
        padding: spacings.large,
    },
    title: {
        fontSize: style.fontSizeMedium.fontSize,
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: spacings.small,
    },
    orderDate: {
        fontSize: style.fontSizeSmall2x.fontSize,
        fontWeight: style.fontWeightThin.fontWeight,
        color: grayColor,
        marginVertical: spacings.medium,
    },
    infoContainer: {
        marginBottom: spacings.medium,
    },
    infoTitle: {
        fontSize: style.fontSizeMedium.fontSize,
        color: blackColor,
        marginBottom: spacings.small,
    },
    infoText: {
        fontSize: style.fontSizeSmall2x.fontSize,
        color: grayColor,
    },
    productContainer: {
        marginBottom: spacings.medium,
        paddingVertical: spacings.large,
    },
    productImage: {
        width: wp(15),
        height: wp(15),
        borderRadius: 8,
        backgroundColor: lightGrayColor,
    },
    productDetails: {
        flex: 1,
        marginLeft: spacings.medium,
    },
    productName: {
        fontSize: style.fontSizeMedium.fontSize,
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: 4,
    },
    productInfo: {
        fontSize: style.fontSizeSmall.fontSize,
        color: grayColor,
        paddingTop: spacings.small
    },
    productPrice: {
        fontSize: style.fontSizeMedium.fontSize,
        fontWeight: '600',
        color: blackColor,
    },
    priceDetails: {
        marginTop: spacings.medium,
    },
    priceHeader: {
        fontSize: style.fontSizeMedium.fontSize,
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: spacings.small,
    },
    priceLabel: {
        fontSize: style.fontSizeNormal.fontSize,
        fontWeight: style.fontWeightThin.fontWeight,
        color: grayColor,
    },
    priceValue: {
        fontSize: style.fontSizeNormal.fontSize,
        color: blackColor,
    },
    priceLabelTotal: {
        fontSize: style.fontSizeMedium.fontSize,
        fontWeight: 'bold',
        color: blackColor,
    },
    priceValueTotal: {
        fontSize: style.fontSizeMedium.fontSize,
        fontWeight: 'bold',
        color: blackColor,
    },
    separator: {
        width: wp(100),
        height: 1,
        backgroundColor: "#d9d9d9",
        marginBottom: spacings.large,
    },
    priceRow: {
        marginVertical: spacings.normal,
        width: "100%"
    }
});

export default OrderDetailsScreen;
