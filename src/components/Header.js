import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { BELL_IMAGE, FEATHER_LOGO_IMAGE, WALLET_IMAGE } from '../assests/images';
import { blackColor, whiteColor } from '../constants/Color';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { useSelector } from 'react-redux';
import useNotificationCount from '../hooks/useNotificationCount';
const { alignItemsCenter, alignJustifyCenter, flexDirectionRow, borderRadius10, justifyContentSpaceBetween } = BaseStyle;

const Header = ({ navigation }) => {
    const notificationCount = useNotificationCount();
    // console.log("notificationcpount", notificationCount)

    const onPressNotification = () => {
        navigation.navigate("Notification")
    }

    const onPressWallet = () => {
        navigation.navigate("Wallet")
    }
    return (
        <View style={[styles.headerContainer, flexDirectionRow]}>
            <View style={{ width: "95%" }}>
                <Image
                    source={FEATHER_LOGO_IMAGE}
                    style={{ resizeMode: "contain", width: wp(30) }}
                />

            </View>
            <View style={[{ width: "8%"}, flexDirectionRow]}>
                {/* <TouchableOpacity onPress={onPressNotification}>
                    <Image
                        source={BELL_IMAGE}
                        style={[styles.icon, { marginTop: 2 }]}
                    />
                    {notificationCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{notificationCount}</Text>
                        </View>
                    )}
                </TouchableOpacity> */}

                <TouchableOpacity onPress={onPressWallet}>
                    <Image
                        source={WALLET_IMAGE}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: hp(7),
        backgroundColor: '#fff',
        width: "100%",
        alignItems: 'center',
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    icon: {
        width: 25,
        height: 25,
        resizeMode: "contain"
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'red',
        borderRadius: 8,
        height: 16,
        minWidth: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 2,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default Header;
