import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { blackColor, grayColor, whiteColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { BANNER_IMAGE } from '../assests/images';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { useFocusEffect } from '@react-navigation/native';
import { addNotification } from '../redux/actions';
import { triggerLocalNotification } from '../notificationService';
import LoaderModal from '../components/modals/LoaderModal';
const { flex, alignItemsCenter, flexDirectionRow, textAlign, alignJustifyCenter, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute } = BaseStyle;

const OfferScreen = ({ navigation }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const dispatch = useDispatch();
    const [offers, setOffers] = useState(null);
    const [loading, setLoading] = useState(true);
    const renderCarouselItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('WebViewScreen', { url: item.offerLink })}>
            <View style={[alignItemsCenter]}>
                <Image source={{ uri: item.fileUrl }} style={styles.carouselImage} />
                <View style={styles.captionContainer}>
                    {/* <Text style={[textAlign, positionAbsolute, { bottom: 50, left: 35, right: 35, color: whiteColor }]}>{item.name}</Text> */}
                    <Text style={[styles.categoryLabel, textAlign, positionAbsolute, { bottom: 10, left: 35, right: 35 }]}>{item.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

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

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch("https://rivo-admin-c5ddaab83d6b.herokuapp.com/api/proxy/offers?page=1&limit=10", {
                    method: "GET",
                    redirect: "follow",
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setOffers(result.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
            listenForPushNotifications();
        }, [])
    );

    return (
        <View style={[styles.container, flex]}>
            <Header navigation={navigation} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginVertical: spacings.large }}>
                    <Carousel
                        data={offers?.slice(1, 4)}
                        renderItem={renderCarouselItem}
                        sliderWidth={wp(100)}
                        itemWidth={wp(100)}
                        onSnapToItem={(index) => setActiveSlide(index)}
                    />
                    <Pagination
                        dotsLength={3}
                        activeDotIndex={activeSlide}
                        containerStyle={styles.paginationContainer}
                        dotStyle={styles.dotStyle}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                    />
                </View>
                <Text style={[styles.sectionHeader, textAlign]}>Luxury In Layers</Text>
                <FlatList
                    data={offers}
                    horizontal
                    // keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.categories}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => navigation.navigate('WebViewScreen', { url: item.offerLink })}>
                            <View style={[styles.categoryBox, borderRadius10]}>
                                <Image source={{ uri: item.fileUrl }} style={[styles.categoryImage, resizeModeCover, borderRadius10]} />
                                <View style={[styles.overlay, borderRadius10, alignJustifyCenter]}>
                                    <Text style={[styles.categoryLabel, textAlign, positionAbsolute, { fontSize: style.fontSizeSmall2x.fontSize, }]}>{item.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                <FlatList
                    data={offers?.slice(0, 1)}
                    horizontal
                    // keyExtractor={(item) => item.id}
                    contentContainerStyle={{ width: "100%" }}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[{ width: "95%", height: hp(15), margin: spacings.large, alignItemsCenter, backgroundColor: "#2D2D27" }, borderRadius10]}
                            onPress={() => navigation.navigate('WebViewScreen', { url: item.offerLink })}>
                            <Image source={{ uri: item.fileUrl }} style={[{ width: "100%", height: hp(15) }, borderRadius10]} />
                        </TouchableOpacity>
                    )}
                />
                {loading && (
                    <LoaderModal visible={loading} message="Please wait..." />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: whiteColor,
    },
    carouselImage: {
        width: "100%",
        height: hp(45),
    },
    categories: {
        paddingHorizontal: spacings.large,
    },
    categoryBox: {
        alignItems: "center",
        marginHorizontal: spacings.small,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    categoryImage: {
        width: wp(28),
        height: wp(28),
    },
    categoryLabel: {
        color: whiteColor,
        fontSize: style.fontSizeLarge2x.fontSize,
        fontWeight: style.fontWeightMedium.fontWeight,
        bottom: spacings.large,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    paginationContainer: {
        paddingVertical: spacings.large,
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: blackColor,
    },
    captionContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 10,
        height: hp(45),
    },
    sectionHeader: {
        fontSize: style.fontSizeLarge1x.fontSize,
        fontWeight: style.fontWeightMedium.fontWeight,
        marginBottom: spacings.large
    },

});

export default OfferScreen;
