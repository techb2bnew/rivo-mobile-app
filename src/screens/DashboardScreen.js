import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, Pressable } from 'react-native';
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
const { flex, alignItemsCenter, flexDirectionRow, alignJustifyCenter, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, justifyContentSpaceBetween, textAlign } = BaseStyle;

const DashBoardScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isbarCodeModalVisible, setIsbarCodeModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [balancePoint, setBalancePoint] = useState(null);
    const [userName, setUserName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [tierStatus, setTierStatus] = useState(null);
    const [expiryPointsData, setExpiryPointsData] = useState([]);
    const dispatch = useDispatch();

    const data = [
        {
            id: '1',
            title: `${userName}`,
            points: phoneNumber != null ? `${phoneNumber}` : '8580765445',
            backgroundColor: "#1c1c1c",
            textColor: whiteColor,
            subtextColor: whiteColor,
            imageBackground: "#e6e6e6",
            icon: CARD_IMAGE,
            name: `${userName}`
        },
        // {
        //     id: '2',
        //     title: 'Points Earned',
        //     points: '1000PT',
        //     backgroundColor: "#f5f5f5",
        //     textColor: blackColor,
        //     subtextColor: mediumGray,
        //     imageBackground: "#e6e6e6",
        //     icon: SALARY_IMAGE,
        // },
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
        // {
        //     id: '4',
        //     title: 'Points Spent',
        //     points: '400PT',
        //     backgroundColor: "#f5f5f5",
        //     textColor: blackColor,
        //     subtextColor: mediumGray,
        //     imageBackground: "#e6e6e6",
        //     icon: STAR_IMAGE
        // },
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

    // const expirydata = [
    //     { date: "20/12/2023", points: "5,00,000" },
    //     { date: "02/02/2024", points: "10,00,000" },
    //     { date: "05/06/2024", points: "20,000" },
    //     { date: "20/12/2023", points: "5,00,000" },
    //     { date: "20/12/2023", points: "5,00,000" },
    //     { date: "20/12/2023", points: "5,00,000" },
    //     { date: "20/12/2023", points: "5,00,000" },
    //     { date: "20/12/2023", points: "5,00,000" },
    //     { date: "20/12/2023", points: "5,00,000" },
    //     { date: "20/12/2023", points: "5,00,000" },
    //     { date: "20/12/2023", points: "5,00,000" },
    // ];
 
    
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
                const availablePoints = response.data?.data?.available_loyalty_points;
                await AsyncStorage.setItem('currentPoints', String(availablePoints));
                setBalancePoint(response.data?.data?.available_loyalty_points);
                setUserName(response.data?.data?.full_name);
                setPhoneNumber(response.data?.data?.phone);
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

            const from_date = "2023-12-1";
            const to_date = "2024-12-15";

            const response = await fetch(
                `https://publicapi.dev.saasintegrator.online/api/orders?page=1&per_page=25&from_date=${from_date}&to_date=${to_date}`,
                { method: "GET", headers: myHeaders }
            );

            const result = await response.json();
            // console.log("result.data.data", result.data.data.length);
            dispatch(saveOrderLength(result.data.data.length));
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

    const renderItem = ({ item }) => (
        <Pressable style={[styles.card, { backgroundColor: item.backgroundColor }, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween, borderRadius10]}
            onPress={() => {
                if (item.id === '1') {
                    openModal(item)
                }
            }}
        >
            <View>
                <Text style={[styles.pointsText, { color: item.textColor }]}>{item.points}</Text>
                <Text style={[styles.subText, { color: item.subtextColor }]}>{capitalizeWords(item.title)}</Text>
            </View>
            <View style={[styles.iconBox, borderRadius10, { backgroundColor: item.imageBackground }, alignJustifyCenter]}>
                <Image source={item.icon} style={[styles.icon, resizeModeContain]} />
            </View>
        </Pressable>
    );

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

            {modalVisible && <ExpirePointsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                data={expiryPointsData}
            />}
            {isbarCodeModalVisible && <BarcodeModal
                isVisible={isbarCodeModalVisible}
                data={selectedData}
                onClose={closeModal}
            />}
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
        width: wp(20),
        height: wp(20),
        borderRadius: 50,
        backgroundColor: whiteColor,
        bottom: hp(5),
        right: wp(5),
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 5,
        borderWidth: 5,
        borderColor: "#000",
        padding: 2
    },
    expirePointsText: {
        color: whiteColor,
        fontSize: 14,
        fontWeight: '600'
    },
});

export default DashBoardScreen;
