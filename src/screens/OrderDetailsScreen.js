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
    const calculateTotalPrice = () => {
        // Calculate the total price of items
        const totalPrice = order.items.reduce((total, item) => {
            // const price = parseFloat(item?.price?.replace('$', ''));
            const price = item.price
            return total + price * item.quantity;
        }, 0);

        // Add shipping cost (if available, else default to $0)
        const shippingCost = order.shipping
            ? parseFloat(order.shipping)
            : 0;  // Default to 0 if shipping is missing or undefined

        const grandTotal = totalPrice + shippingCost;

        // Return the grand total rounded to 2 decimal places
        return grandTotal.toFixed(2);
    };


    const totalPrice = order.total ? order.total : calculateTotalPrice();
    return (
        <View style={[styles.container, flex]}>
            <View style={{ width: wp(100), height: "auto", padding: spacings.large }}>
                <Pressable onPress={() => { navigation.goBack(); }}>
                    <Ionicons name="arrow-back" size={30} color={blackColor} />
                </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>#{order.id}</Text>
                <Text style={styles.orderDate}>
                    {order.date} at {order.time} from {order.store}
                </Text>

                <View style={styles.separator} />
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>{LOCATION}</Text>
                    <Text style={styles.infoText}>{order.location}</Text>
                </View>

                <View style={styles.separator} />
                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>{DELIVERY_METHOD}</Text>
                    <Text style={styles.infoText}>{order.deliveryMethod}</Text>
                </View>

                <View style={styles.separator} />
                {order.items.map((item) => (
                    <>
                        <View key={item.id} style={[styles.productContainer, flexDirectionRow, alignItemsCenter]}>
                            <Image source={{ uri: item.image }} style={styles.productImage} />
                            <View style={styles.productDetails}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productInfo}>-{item.id}</Text>
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
                    <View style={[styles.priceRow, flexDirectionRow, justifyContentSpaceBetween]}>
                        <Text style={styles.priceLabel}>{SUBTOTAL}</Text>
                        <Text style={styles.priceValue}>${order.subtotal}</Text>
                    </View>
                    <View style={[styles.priceRow, flexDirectionRow, justifyContentSpaceBetween]}>
                        <Text style={styles.priceLabel}>{SHIPPING}</Text>
                        <Text style={styles.priceValue}>${(order.shipping) ? (order.shipping) : "--"}</Text>
                    </View>
                    <View style={[styles.priceRow, flexDirectionRow, justifyContentSpaceBetween]}>
                        <Text style={styles.priceLabelTotal}>{TOTAL}</Text>
                        <Text style={styles.priceValueTotal}>${totalPrice}</Text>
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
        fontSize: style.fontSizeLarge.fontSize,
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: spacings.small,
    },
    orderDate: {
        fontSize: style.fontSizeSmall2x.fontSize,
        fontWeight: style.fontWeightThin.fontWeight,
        color: grayColor,
        marginBottom: spacings.medium,
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
