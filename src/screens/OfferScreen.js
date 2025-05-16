import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import Header from '../components/Header';
import { blackColor, grayColor, lightGrayColor, lightShadeBlue, mediumGray, whiteColor } from '../constants/Color';
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
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encrypt } from '../encrypt';
import { API_SECRET, APP_ID, APP_USER_AGENT, encryptedApiSecret, encryptedAppId, encryptedUserAgent } from '../constants/Constants';

const { flex, alignItemsCenter, flexDirectionRow, textAlign, alignJustifyCenter, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute } = BaseStyle;

const OfferScreen = ({ navigation }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const dispatch = useDispatch();
    const [offers, setOffers] = useState(null);
    const [loading, setLoading] = useState(true);
    const renderCarouselItem = ({ item }) => (
        <Pressable onPress={() => navigation.navigate('WebViewScreen', { url: item.offerLink })}>
            <View style={[alignItemsCenter]}>
                <Image source={{ uri: item.fileUrl }} style={styles.carouselImage} />
                <View style={styles.captionContainer}>
                    <Text style={[styles.categoryLabel, textAlign, positionAbsolute, { bottom: 10, left: 35, right: 35 }]}>{item.name}</Text>
                </View>
            </View>
        </Pressable>
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

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch("https://rivo-admin-c5ddaab83d6b.herokuapp.com/api/proxy/mobileAppOffers?page=1&limit=1000", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-secret": encrypt(API_SECRET),
                        "x-app-id": encrypt(APP_ID),
                        "User-Agent": encrypt(APP_USER_AGENT),
                    },
                    redirect: "follow",
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setOffers(result.data);
                console.log(result.data.length);

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
            listenForForegroundPushNotifications();
        }, [])
    );

    return (
        <View style={[styles.container, flex]}>
            <Header navigation={navigation} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {offers?.length > 0 ? (
                    <>
                        <View style={{ marginVertical: spacings.large }}>
                            <Carousel
                                data={offers?.slice(0, 3)}
                                renderItem={renderCarouselItem}
                                sliderWidth={wp(100)}
                                itemWidth={wp(100)}
                                onSnapToItem={(index) => setActiveSlide(index)}
                            />
                            <Pagination
                                dotsLength={offers?.slice(0, 3).length}
                                activeDotIndex={activeSlide}
                                containerStyle={styles.paginationContainer}
                                dotStyle={styles.dotStyle}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                            />
                        </View>
                        <Text style={[styles.sectionHeader, textAlign]}>Luxury In Layers</Text>
                        <FlatList
                            data={offers.slice(3, 6)}
                            // data={offers.filter((_, index) => index > 2)}
                            horizontal
                            // keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.categories}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => navigation.navigate('WebViewScreen', { url: item.offerLink })}>
                                    <View style={[styles.categoryBox, borderRadius10]}>
                                        <Image source={{ uri: item.fileUrl }} style={[styles.categoryImage, resizeModeCover, borderRadius10]} />
                                        <View style={[styles.overlay, borderRadius10, alignJustifyCenter]}>
                                            <Text style={[styles.categoryLabel, textAlign, positionAbsolute, { fontSize: style.fontSizeSmall2x.fontSize, }]}>{item.name}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            )}
                        />

                        <FlatList
                            data={offers?.slice(7, 8)}
                            horizontal
                            // keyExtractor={(item) => item.id}
                            contentContainerStyle={{ width: "100%" }}
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <Pressable style={[{ width: "95%", height: hp(15), margin: spacings.large, alignItemsCenter, backgroundColor: "#2D2D27" }, borderRadius10]}
                                    onPress={() => navigation.navigate('WebViewScreen', { url: item.offerLink })}>
                                    <Image source={{ uri: item.fileUrl }} style={[{ width: "100%", height: hp(15) }, borderRadius10]} />
                                </Pressable>
                            )}
                        />

                        <FlatList
                            data={offers.slice(8)}
                            contentContainerStyle={styles.categories}
                            showsHorizontalScrollIndicator={false}
                            numColumns={3}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => navigation.navigate('WebViewScreen', { url: item.offerLink })}>
                                    <View style={[styles.categoryBox, borderRadius10, { marginBottom: 10 }]}>
                                        <Image source={{ uri: item.fileUrl }} style={[styles.categoryImage, resizeModeCover, borderRadius10]} />
                                        <View style={[styles.overlay, borderRadius10, alignJustifyCenter]}>
                                            <Text style={[styles.categoryLabel, textAlign, positionAbsolute, { fontSize: style.fontSizeSmall2x.fontSize, }]}>{item.name}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            )}
                        />
                    </>
                ) : (
                    <View style={{ alignItems: "center", justifyContent: "center", margin: spacings.xLarge, backgroundColor: whiteColor, height: hp(80) }}>
                        <Text style={{ fontSize: 18, color: grayColor, textAlign: "center" }}>No offers available at the moment. Please check back later.
                        </Text>
                    </View>
                )}
                {loading && (
                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: lightGrayColor,
                            // alignItems: "center",
                            // justifyContent: "center",
                            zIndex: 9999,
                        }}
                    >
                        <View>
                            {/* Carousel Loader */}
                            <ContentLoader width={"100%"} height={400} speed={1.5} foregroundColor={lightShadeBlue}>
                                <Rect x="0" y="0" rx="10" ry="10" width="100%" height="400" />
                            </ContentLoader>

                            {/* Categories Loader */}
                            <FlatList
                                data={[1, 2, 3, 4]}
                                horizontal
                                renderItem={() => (
                                    <ContentLoader width={100} height={120} margin={10} speed={1.5} foregroundColor={lightShadeBlue}>
                                        <Rect x="0" y="0" rx="10" ry="10" width="100" height="120" />
                                    </ContentLoader>
                                )}
                            />

                            <ContentLoader width={"100%"} height={100} speed={1.5} foregroundColor={lightShadeBlue}>
                                <Rect x="10" y="0" rx="10" ry="10" width="95%" height="130" />
                            </ContentLoader>
                        </View>
                    </View>
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
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    categoryImage: {
        width: wp(30),
        height: wp(30),
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
        width: 20,
        height: 8,
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
