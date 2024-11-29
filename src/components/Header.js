import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { BELL_IMAGE, FEATHER_LOGO_IMAGE, WALLET_IMAGE } from '../assests/images';
import { blackColor, whiteColor } from '../constants/Color';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
const { alignItemsCenter, alignJustifyCenter, flexDirectionRow, borderRadius10, justifyContentSpaceBetween } = BaseStyle;

const Header = ({navigation}) => {
    const onPressNotification = () => {
        navigation.navigate("Notification")
    }

    const onPressWallet = () => {
        navigation.navigate("Wallet")
    }

    return (
        <View style={[styles.headerContainer, flexDirectionRow]}>
            <View style={{ width: "82%" }}>
                <Image
                    source={FEATHER_LOGO_IMAGE}
                    style={{ resizeMode: "contain", width: wp(30) }}
                />

            </View>
            <View style={[{ width: "18%" }, justifyContentSpaceBetween, flexDirectionRow]}>
                <TouchableOpacity onPress={onPressNotification}>
                    <Image
                        source={BELL_IMAGE}
                        style={styles.icon}
                    />
                </TouchableOpacity>

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
});

export default Header;
