import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, Pressable, ActivityIndicator, TouchableOpacity } from 'react-native';
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

const { flex, alignItemsCenter, flexDirectionRow, alignJustifyCenter, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, justifyContentSpaceBetween, textAlign } = BaseStyle;

const DashBoardScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isbarCodeModalVisible, setIsbarCodeModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [balancePoint, setBalancePoint] = useState(null);
    const [userName, setUserName] = useState("");
    const [userID, setUserID] = useState("");
    const [phoneNumber, setPhoneNumber] = useState('');
    const [tierStatus, setTierStatus] = useState('');
    const [expiryPointsData, setExpiryPointsData] = useState([]);
    const [isBiometricModalVisible, setIsBiometricModalVisible] = useState(false);
    const dispatch = useDispatch();

    const data = [
        {
            id: '1',
            title: `${userName}`,
            points: `${phoneNumber}`,
            backgroundColor: "#1c1c1c",
            textColor: whiteColor,
            subtextColor: whiteColor,
            imageBackground: "#e6e6e6",
            icon: CARD_IMAGE,
            name: `${userName}`
        },
        {
            id: '2',
            title: 'Points Balance',
            points: `${balancePoint} PT`,
            backgroundColor: "#f5f5f5",
            textColor: blackColor,
            subtextColor: "#808080",
            imageBackground: "#e6e6e6",
            icon: COIN_IMAGE,
        },
        {
            id: '3',
            title: 'Tier Status',
            points: `${tierStatus}`,
            backgroundColor: "#1c1c1c",
            textColor: whiteColor,
            subtextColor: whiteColor,
            imageBackground: "#e6e6e6",
            icon: SHEET_IMAGE
        },
    ];

    useEffect(() => {
        const checkFirstLaunch = async () => {
            try {
                const firstLoginCompleted = await AsyncStorage.getItem("firstLoginCompleted");

                if (firstLoginCompleted === "true") {
                    // Show biometric modal if it's the second launch
                    setIsBiometricModalVisible(true);
                } else {
                    // If it's the first launch, set the flag to true
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

    const fetchExpPoints = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (!userToken) {
                console.error("User token not found in local storage");
                return;
            }

            const headers = new Headers();
            headers.append("Authorization", `Bearer ${userToken}`);
            headers.append("Content-Type", "application/json");


            const url = `https://publicapi.dev.saasintegrator.online/api/points-events?plugin_id=${PLUGGIN_ID}`;

            const requestOptions = {
                method: "GET",
                headers: headers,
                redirect: "follow",
            };

            const response = await fetch(url, requestOptions);

            const result = await response.json();
            setExpiryPointsData(result?.data)
            // console.log("ExpPoints", result.data);
        } catch (error) {
            console.error("Error fetching ExpPoints:", error);
        }
    };

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
            fetchProfileData();
            fetchOrdersFromAPI();
            fetchExpPoints();
        }, [])
    );

    useEffect(() => {
        if (balancePoint !== null) {
            fetchTiers(balancePoint);
        }
    }, [balancePoint]);

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
                // console.log("response.data?.data",response.data?.data?.uid)
                const availablePoints = response.data?.data?.available_loyalty_points;
                await AsyncStorage.setItem('currentPoints', String(availablePoints));
                setBalancePoint(response.data?.data?.available_loyalty_points);
                setUserName(response.data?.data?.full_name);
                setPhoneNumber(response.data?.data?.phone);
                setUserID(response.data?.data?.uid)
            } else {
                throw new Error('Failed to fetch profile data');
            }
        } catch (err) {
            console.error('Error fetching profile data:', err.message || err);
        }
    };

    const fetchTiers = async (balancePoint) => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            if (!token) {
                console.warn("Token missing in AsyncStorage");
                return;
            }
            const url = `https://publicapi.dev.saasintegrator.online/api/vip-tiers?plugin_id=${PLUGGIN_ID}`;
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);
            myHeaders.append("Content-Type", "application/json");

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            const response = await fetch(url, requestOptions);
            const result = await response.json();

            if (result.success && result.data) {
                const tiers = result.data;

                const tierNamesAndThresholds = tiers.map(tier => ({
                    threshold: tier.threshold,
                    name: tier.name,
                }));

                tierNamesAndThresholds.sort((a, b) => a.threshold - b.threshold);

                let selectedTier = null;

                for (let i = 0; i < tierNamesAndThresholds.length; i++) {
                    const tier = tierNamesAndThresholds[i];

                    if (balancePoint >= tier.threshold) {
                        selectedTier = tier.name;
                    } else {
                        break;
                    }
                }
                if (selectedTier) {
                    // console.log("Selected Tier:", selectedTier);
                    setTierStatus(selectedTier);
                } else {
                    console.log("No tier found for the balance point.");
                    setTierStatus(null);
                }
            } else {
                console.error("Failed to fetch tiers:", result.message);
            }
        } catch (error) {
            console.error("Error fetching tiers:", error);
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
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    const navigateToFAQ = () => {
        navigation.navigate('FAQ');  
    };

    const renderItem = ({ item }) => {
        // Only render the card if the item has a phone number (for id === '1') or points (for others)
        if (item.id === '1' && !phoneNumber) {
            return null; // Do not render the card if phone number is missing
        }

        return (
            <Pressable
                style={[
                    styles.card,
                    { backgroundColor: item.backgroundColor },
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
                <View>
                    {item.points ? (
                        <Text style={[styles.pointsText, { color: item.textColor }]}>
                            {item.points}
                        </Text>
                    ) : (
                        <ActivityIndicator size={"small"} color={item.textColor} />
                    )}
                    <Text style={[styles.subText, { color: item.subtextColor }]}>
                        {capitalizeWords(item.title)}
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
            </Pressable>
        );
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
            />
            <Pressable
                style={[styles.expirePointsButton, alignJustifyCenter, positionAbsolute]}
                onPress={() => setModalVisible(true)}
            >
                <View style={[{ width: "100%", height: "100%", backgroundColor: '#000', borderRadius: 50 }, alignJustifyCenter]}>
                    <Text style={[styles.expirePointsText, textAlign]}>{EXPIRE_POINTS}</Text>
                </View>
            </Pressable>

            <TouchableOpacity onPress={navigateToFAQ} style={[styles.faqButton, positionAbsolute]}>
                <Icon name="help-circle-outline" size={50} color="#fff" />
            </TouchableOpacity>

            {modalVisible && !isbarCodeModalVisible &&
                <ExpirePointsModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    data={expiryPointsData}
                />}
            {isbarCodeModalVisible && !modalVisible &&
                <BarcodeModal
                    isVisible={isbarCodeModalVisible}
                    data={selectedData}
                    onClose={closeModal}
                />}
            {isBiometricModalVisible && <BiometricModal />}
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
        fontSize: 12,
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
    },
});

export default DashBoardScreen;
