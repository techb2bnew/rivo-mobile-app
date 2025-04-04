import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, Pressable, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import Header from '../components/Header';
import { grayColor, whiteColor, blackColor, lightGrayColor, mediumGray } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { CARD_IMAGE, COIN_IMAGE, SALARY_IMAGE, SHEET_IMAGE, STAR_IMAGE } from '../assests/images';
import ExpirePointsModal from '../components/modals/ExpirePointsModal';
import { EXPIRE_POINTS, PLUGGIN_ID } from '../constants/Constants';
import BarcodeModal from '../components/modals/BarcodeModal';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { useFocusEffect } from '@react-navigation/native';
import { addNotification } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { saveOrderLength } from '../redux/orders/orderAction';
import BiometricModal from '../components/modals/BiometricModal';
import Icon from 'react-native-vector-icons/Ionicons';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const { flex, alignItemsCenter, flexDirectionRow, alignJustifyCenter, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, justifyContentSpaceBetween, textAlign } = BaseStyle;

const DashBoardScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isbarCodeModalVisible, setIsbarCodeModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [balancePoint, setBalancePoint] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userID, setUserID] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [tierStatus, setTierStatus] = useState(null);
    const [expiryPointsData, setExpiryPointsData] = useState("");
    const [isBiometricModalVisible, setIsBiometricModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();

    const data = [
        {
            id: '1',
            points: `${userName}`,
            title: `${phoneNumber}`,
            backgroundColor: "#1c1c1c",
            textColor: whiteColor,
            subtextColor: whiteColor,
            imageBackground: "#e6e6e6",
            icon: CARD_IMAGE,
            name: `${userName}`,
            memberShip: `${tierStatus}`
        },
        {
            id: '2',
            points: `${balancePoint} PT`,
            title: 'Points Balance',
            backgroundColor: "#f5f5f5",
            textColor: blackColor,
            subtextColor: "#808080",
            imageBackground: "#e6e6e6",
            icon: COIN_IMAGE,
        },
        {
            id: '3',
            points: `${tierStatus}`,
            title: 'Tier Status',
            backgroundColor: "#1c1c1c",
            textColor: whiteColor,
            subtextColor: whiteColor,
            imageBackground: "#e6e6e6",
            icon: SHEET_IMAGE
        },
    ];

    useEffect(() => {
        console.log("isBiometricModalVisible", isBiometricModalVisible);

        const checkFirstLaunch = async () => {
            try {
                const firstLoginCompleted = await AsyncStorage.getItem("firstLoginCompleted");
                const userToken = await AsyncStorage.getItem('userToken');

                if (firstLoginCompleted == "true" && userToken) {
                    setIsBiometricModalVisible(true);
                } else {
                    await AsyncStorage.setItem("firstLoginCompleted", "true");
                }
            } catch (error) {
                console.error("Error checking first launch:", error);
            }
        };

        checkFirstLaunch();
    }, []);

    const openModal = (item) => {
        setSelectedData(item);
        setIsbarCodeModalVisible(true);
    };

    const closeModal = () => {
        setIsbarCodeModalVisible(false);
        setSelectedData(null);
    };

    const fetchNotifications = () => {
        PushNotification.getDeliveredNotifications((deliveredNotifications) => {
            console.log("Delivered Notifications:", deliveredNotifications); // Log all notifications

            deliveredNotifications.forEach((notification) => {
                console.log("Notification:", notification); // Log each notification

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
            console.log('listenForPushNotifications:', remoteMessage);
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

    // const fetchExpPoints = async () => {
    //     try {
    //         const userToken = await AsyncStorage.getItem('userToken');
    //         if (!userToken) {
    //             console.error("User token not found in local storage");
    //             return;
    //         }

    //         const headers = new Headers();
    //         headers.append("Authorization", `Bearer ${userToken}`);
    //         headers.append("Content-Type", "application/json");


    //         const url = `https://publicapi.dev.saasintegrator.online/api/points-events?plugin_id=${PLUGGIN_ID}`;

    //         const requestOptions = {
    //             method: "GET",
    //             headers: headers,
    //             redirect: "follow",
    //         };

    //         const response = await fetch(url, requestOptions);

    //         const result = await response.json();
    //         setExpiryPointsData(result?.data)
    //         console.log("ExpPoints", result.data);
    //     } catch (error) {
    //         console.error("Error fetching ExpPoints:", error);
    //     }
    // };

    const sendNotificationData = async (token, userID, userName) => {
        if (!token || !userID || !userName) {
            console.log("Error", "Missing required data to send the notification.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("userId", userID);
            formData.append("userName", userName);
            formData.append("fcmToken", token);

            const requestOptions = {
                method: "POST",
                body: formData,
                redirect: "follow",
            };

            const response = await fetch(
                "https://rivo-admin-c5ddaab83d6b.herokuapp.com/api/notifications",
                requestOptions
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text();
            console.log("Success", result);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        const handleNotificationData = async () => {
            const savedToken = await AsyncStorage.getItem('fcmToken');
            if (savedToken && userID && userName) {
                sendNotificationData(savedToken, userID, userName);
            }
        };
        handleNotificationData();
    }, [userID, userName]);


    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
            listenForPushNotifications();
            listenForForegroundPushNotifications();
            fetchProfileData();
            fetchOrdersFromAPI();
            // fetchExpPoints();
        }, [])
    );

    const fetchProfileData = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                throw new Error('Token not found');
            }
            const response = await axios.get('https://publicapi.dev.saasintegrator.online/api/profile', {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                console.log("response.data?.data", response.data?.data)
                const availablePoints = response.data?.data?.available_loyalty_points;
                setTierStatus(response.data?.data.tier_groups?.[0]?.name)
                setBalancePoint(Math.floor(response.data?.data?.available_loyalty_points));
                setUserName(response.data?.data?.full_name);
                setPhoneNumber(response.data?.data?.meta_map_values?.[0]?.value);
                setUserID(response.data?.data?.uid);
                setExpiryPointsData(response.data?.data?.loyalty_point_expiration_date)
                await AsyncStorage.setItem('currentPoints', String(availablePoints));
                await AsyncStorage.setItem('currentTier', response.data?.data.tier_groups?.[0]?.name);
            } else {
                throw new Error('Failed to fetch profile data');
            }
        } catch (err) {
            console.error('Error fetching profile data:', err.message || err);
        }
    };

    const fetchOrdersFromAPI = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.log('No authentication token found');
                return;
            }
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Accept", "application/json");

            const from_date = "";
            const to_date = "";

            const response = await fetch(
                `https://publicapi.dev.saasintegrator.online/api/orders?page=1&per_page=30&from_date=${from_date}&to_date=${to_date}`,
                { method: "GET", headers: myHeaders }
            );

            const result = await response.json();
            console.log("result.data.data", result.data.orders.length);
            dispatch(saveOrderLength(result.data.orders.length));
        } catch (error) {
            console.error("Error fetching orders:", error.message);
        }
    };

    const capitalizeWords = (str) => {
        if (!str) return "";
        return str
            .split(" ")
            .map(word => 
                word === word.toUpperCase() 
                    ? word 
                    : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
    };

    const navigateToFAQ = () => {
        navigation.navigate('FAQ');
    };


    const renderItem = ({ item }) => {
        const isLoading = !item.points || balancePoint === null || balancePoint === undefined;
        if (item.title === "undefined" || item.points === "undefined" || item.title === "null" || item.points === "null") {
            console.log("Skipping Item:", item);
            return null;
        }
        console.log(isLoading);
        
        return (
            <Pressable
                style={[
                    styles.card,
                    { backgroundColor: isLoading ? lightGrayColor : item.backgroundColor },
                    flexDirectionRow,
                    alignItemsCenter,
                    justifyContentSpaceBetween,
                    borderRadius10
                ]}
                onPress={() => {
                    if (item.id === '1') {
                        openModal(item);
                    }
                }}
            >
                {isLoading ? (
                    <ContentLoader
                        speed={2}
                        width={wp(90)} // Adjust the width according to your design
                        height={80} // Adjust the height
                        // viewBox="0 0 290 80"
                        backgroundColor="#f0f0f0"
                        foregroundColor={grayColor}
                    >
                        {/* Skeleton for the text */}
                        <Rect x="10" y="10" rx="4" ry="4" width="100" height="20" />
                        <Rect x="10" y="40" rx="4" ry="4" width="150" height="20" />
                        <Rect x={wp(70)} y="5" rx="8" ry="8" width="66" height="66" />
                    </ContentLoader>
                ) : (
                    <>
                        <View>
                            <Text style={[styles.pointsText, { color: item.textColor }]}>
                                {capitalizeWords(item?.points)}
                            </Text>
                            <Text style={[styles.subText, { color: item.subtextColor }]}>
                                {capitalizeWords(item?.title)}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.iconBox,
                                borderRadius10,
                                { backgroundColor: item.imageBackground },
                                alignJustifyCenter
                            ]}
                        >
                            <Image source={item.icon} style={[styles.icon, resizeModeContain]} />
                        </View>
                    </>
                )}
            </Pressable>
        );
    };


    const onRefresh = async () => {
        setRefreshing(true);
        fetchProfileData();
        setRefreshing(false);
    };

    return (
        <View style={[styles.container, flex]}>
            <Header navigation={navigation} />
            <View style={styles.separator} />
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.content}
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
            {expiryPointsData && expiryPointsData !== null && <Pressable
                style={[styles.expirePointsButton, alignJustifyCenter, positionAbsolute]}
                onPress={() => setModalVisible(true)}
            >
                <View style={[{ width: "100%", height: "100%", backgroundColor: '#000', borderRadius: 50 }, alignJustifyCenter]}>
                    <Text style={[styles.expirePointsText, textAlign]}>{EXPIRE_POINTS}</Text>
                </View>
            </Pressable>}

            <TouchableOpacity onPress={navigateToFAQ} style={[styles.faqButton, positionAbsolute]}>
                <Icon name="help-circle-outline" size={50} color="#fff" />
            </TouchableOpacity>

            {modalVisible && !isbarCodeModalVisible &&
                <ExpirePointsModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    point={balancePoint}
                    data={expiryPointsData}
                />}
            {isbarCodeModalVisible && !modalVisible &&
                <BarcodeModal
                    isVisible={isbarCodeModalVisible}
                    data={selectedData}
                    onClose={closeModal}
                />}
            {/* {isBiometricModalVisible && <BiometricModal />} */}

            {isBiometricModalVisible && <BiometricModal isBiometricModalVisible={isBiometricModalVisible} setIsBiometricModalVisible={setIsBiometricModalVisible} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: whiteColor,
    },
    separator: {
        width: wp(100),
        height: 1,
        backgroundColor: "#d9d9d9",
        marginBottom: spacings.large,
    },
    content: {
        paddingHorizontal: spacings.large,
    },
    card: {
        padding: 15,
        marginVertical: spacings.large,
    },
    pointsText: {
        fontSize: style.fontSizeMedium1x.fontSize,
        fontWeight: style.fontWeightMedium1x.fontWeight,
    },
    subText: {
        fontSize: style.fontSizeNormal.fontSize,
        marginTop: spacings.small,
    },
    iconBox: {
        width: wp(21),
        height: hp(9.5),
    },
    icon: {
        width: wp(15),
        height: hp(7)
    },
    expirePointsButton: {
        width: wp(18),
        height: wp(18),
        borderRadius: 50,
        backgroundColor: whiteColor,
        bottom: hp(15),
        right: wp(5),
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 5,
        borderWidth: 5,
        borderColor: "#000",
        padding: 2,
        zIndex: 999
    },
    expirePointsText: {
        color: whiteColor,
        fontSize: 10,
        fontWeight: '600'
    },
    faqButton: {
        width: wp(18),
        height: wp(18),
        borderRadius: 50,
        backgroundColor: "#1c1c1c",
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        bottom: hp(5),
        right: wp(5),
        zIndex: 999
    },
});

export default DashBoardScreen;
