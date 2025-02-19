import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { blackColor, grayColor, whiteColor, lightGrayColor } from '../constants/Color';
import { spacings, style } from '../constants/Fonts';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import CustomButton from '../components/CustomButton';
import { BaseStyle } from '../constants/Style';
import { DELIVERY_METHOD, LOCATION, PRICE_DETAILS, SHIPPING, SUBTOTAL, TOTAL } from '../constants/Constants';
import LoaderModal from '../components/modals/LoaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const { flex, alignItemsCenter, alignItemsFlexStart, flexDirectionRow, textAlign, justifyContentSpaceBetween, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, alignJustifyCenter } = BaseStyle;

const OrderDetailsScreen = ({ route, navigation }) => {
    const { connectionId } = route.params;
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (connectionId) {
            console.log("connectionId:", connectionId);
            fetchOrderDetails(connectionId);
        } else {
            console.error("Invalid connectionId:", connectionId);
        }
    }, [connectionId]);

    const fetchOrderDetails = async (connectionId) => {
        const url = `https://publicapi.dev.saasintegrator.online/api/order-detail/${connectionId}`;
        // const token = "145|q6QFYNtXokrba3jWLFliTtGI2waQWxk0fXcXQ9WV5cf8d4a7";

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.log('No authentication token found');
                return;
            }
            setLoading(true)
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const responseText = await response.text();
            const result = JSON.parse(responseText);
            console.log("fetching order details:", result.data);
            setOrderDetails(result.data);
            setLoading(false);
        } catch (error) {
            setLoading(false)
            console.error("Error fetching order details:", error);
        }
    };


    const capitalizeWords = (str) => {
        if (!str) return "";
        return str
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

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

    const formattedDate = formatDate(orderDetails?.order_created_at);
    const formattedTime = formatTime(orderDetails?.order_created_at);

    return (
        <View style={[styles.container, flex]}>
            <View style={{ width: wp(100), height: "auto", padding: spacings.large }}>
                <Pressable onPress={() => { navigation.goBack(); }}>
                    <Ionicons name="arrow-back" size={30} color={blackColor} />
                </Pressable>
            </View>
            {loading ? (
                // <LoaderModal visible={loading} message="Please wait..." />
                <ContentLoader height={950} width="100%" speed={1.5} backgroundColor="#f3f3f3" foregroundColor={grayColor}>
                    {/* Top section - Order ID and Date */}
                    <Rect x="10" y="20" width="70%" height="30" /> {/* Order ID */}
                    <Rect x="10" y="60" width="50%" height="20" /> {/* Order Date */}

                    {/* Separator */}
                    <Rect x="0" y="90" width="100%" height="1" />

                    {/* Status and Payment Method */}
                    <Rect x="10" y="100" width="60%" height="25" /> {/* Status */}
                    <Rect x="10" y="135" width="70%" height="25" /> {/* Payment Method */}

                    {/* Separator */}
                    {/* <Rect x="0" y="170" width="100%" height="1" /> */}

                    {/* Product details - Assuming 2 products for loader */}
                    <Rect x="15" y="180" width="90%" height="20" />
                    <Rect x="15" y="210" width="90%" height="15" />
                    <Rect x="15" y="230" width="90%" height="15" />
                    {/* <Rect x="10" y="180" width="90%" height="25" />  */}

                    {/* Separator */}
                    <Rect x="0" y="265" width="100%" height="1" />

                    {/* Price Details */}
                    <Rect x="10" y="275" width="90%" height="25" /> {/* Subtotal */}
                    <Rect x="10" y="310" width="90%" height="25" /> {/* Shipping Amount */}
                    <Rect x="10" y="345" width="90%" height="25" /> {/* Total Amount */}

                    {/* Separator */}
                    <Rect x="0" y="380" width="100%" height="1" />

                </ContentLoader>
            ) :
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Order ID: {orderDetails?.uid}</Text>

                    <Text style={styles.orderDate}>
                        {formattedDate} at {formattedTime}
                    </Text>

                    <View style={styles.separator} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoTitle}>{"Status"}</Text>
                        <Text style={styles.infoText}>{capitalizeWords(orderDetails?.status)}</Text>
                    </View>


                    <View style={styles.separator} />
                    {orderDetails?.order_shippings[0]?.shipping_method_name && <>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoTitle}>{DELIVERY_METHOD}</Text>
                            <Text style={styles.infoText}>{orderDetails?.order_shippings[0]?.shipping_method_name}</Text>
                        </View>
                        <View style={styles.separator} />
                    </>}

                    {orderDetails?.loyalty_points_earned != null && (
                        <>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoTitle}>Earned Points</Text>
                                <Text style={styles.infoText}>{capitalizeWords(orderDetails?.loyalty_points_earned)}</Text>
                            </View>
                            <View style={styles.separator} />
                        </>
                    )}

                    {orderDetails?.loyalty_points_redeemed != null && (
                        <>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoTitle}>Redeemed Points</Text>
                                <Text style={styles.infoText}>{capitalizeWords(orderDetails?.loyalty_points_redeemed)}</Text>
                            </View>
                            <View style={styles.separator} />
                        </>
                    )}

                    {orderDetails?.order_items
                        ?.filter((item) => item.product) // Only include items with a product
                        .map((item) => (
                            <React.Fragment key={item.id}>
                                <View style={[styles.productContainer, flexDirectionRow, alignItemsCenter]}>
                                    <Image
                                        source={{
                                            uri:
                                                item.product?.images?.[0]?.url ||
                                                "https://cdn.shopify.com/s/files/1/0890/4035/5626/files/GiftCard_1__Image_e6c0e644-0a85-4d79-95ed-85d2d4e00da3.jpg?v=1729670332",
                                        }}
                                        style={styles.productImage}
                                    />
                                    <View style={styles.productDetails}>
                                        <Text style={styles.productName}>Name : {item?.product?.name}</Text>
                                        <Text style={styles.productInfo}>Sku - {item?.product?.sku}</Text>
                                        <Text
                                            style={[
                                                styles.productInfo,
                                                { color: blackColor, fontWeight: style.fontWeightThin1x.fontWeight, marginTop: 2 },
                                            ]}
                                        >
                                            Qty: {item?.quantity_ordered}
                                        </Text>
                                    </View>
                                    <View style={{ height: "100%", width: "20%" }}>
                                        <Text style={styles.productPrice}>${Math.floor(item.price)}</Text>
                                    </View>
                                </View>
                                <View style={styles.separator} />
                            </React.Fragment>
                        ))}


                    <View style={styles.priceDetails}>
                        {orderDetails?.order_items[0]?.product && <Text style={[styles.priceHeader, justifyContentSpaceBetween, flexDirectionRow]}>{PRICE_DETAILS} ({orderDetails?.order_items?.length} Items)</Text>}
                        {orderDetails?.order_items[0]?.product && <View style={[styles.priceRow, flexDirectionRow, justifyContentSpaceBetween]}>
                            <Text style={styles.priceLabel}>Subtotal</Text>
                            <Text style={styles.priceValue}>${orderDetails?.subtotal}</Text>
                        </View>}
                        {orderDetails?.order_items[0]?.product && <View style={[styles.priceRow, flexDirectionRow, justifyContentSpaceBetween]}>
                            <Text style={styles.priceLabel}>Shipping Amount</Text>
                            <Text style={styles.priceValue}>{orderDetails?.shipping_amount}</Text>
                        </View>}
                        <View style={[styles.priceRow, flexDirectionRow, justifyContentSpaceBetween]}>
                            <Text style={styles.priceLabelTotal}>{TOTAL} Amount</Text>
                            <Text style={styles.priceValueTotal}>${orderDetails?.grand_total}</Text>
                        </View>
                    </View>

                </ScrollView>
            }
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
        fontSize: style.fontSizeNormal2x.fontSize,
        fontWeight: 'bold',
        color: blackColor,
        marginBottom: 4,
    },
    productInfo: {
        fontSize: style.fontSizeSmall2x.fontSize,
        color: grayColor,
        paddingTop: spacings.small
    },
    productPrice: {
        fontSize: style.fontSizeNormal2x.fontSize,
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
