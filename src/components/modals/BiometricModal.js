import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, Modal, StyleSheet, Alert, Platform, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import { spacings, style } from '../../constants/Fonts';
import { blackColor, whiteColor } from "../../constants/Color";
import { FACE_ID_IMAGE, FINGERPRINT_IMAGE, BIOMETRIC_BG_IMAGE, SPLASH_IMAGE } from "../../assests/images";
import ReactNativeBiometrics from 'react-native-biometrics';

const BiometricModal = ({isBiometricModalVisible,setIsBiometricModalVisible}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleBiometricAuthentication = async () => {
        const rnBiometrics = new ReactNativeBiometrics();
    
        try {
            const result = await rnBiometrics.simplePrompt({
                promptMessage: 'Authenticate with Biometrics',
            });
    
            if (result.success) {
                setTimeout(() => setIsBiometricModalVisible(false), 1000);
            } else {
                setTimeout(() => handleBiometricAuthentication(), 1000);
                // Alert.alert('Authentication Failed', 'Please try again.');
            }
        } catch (error) {
            console.error('Biometric authentication error:', error);
            setTimeout(() => handleBiometricAuthentication(), 1000);
        }
    };
    
    useEffect(() => {
        if (isBiometricModalVisible) {
            handleBiometricAuthentication();
        }
    }, [isBiometricModalVisible]);

    return (
        <Modal
            transparent={true}
            onRequestClose={() => setIsBiometricModalVisible(false)}
            animationType="fade"
            presentationStyle="overFullScreen"
        >
            <ImageBackground source={SPLASH_IMAGE} style={styles.backgroundImage}/>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    modalContent: {
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 30,
        borderRadius: 10,
    },
    biometricIcon: {
        width: wp(20),
        height: hp(10),
        marginBottom: spacings.large,
        resizeMode: "contain",
    },
    biometricText: {
        fontSize: style.fontSizeNormal.fontSize,
        fontWeight: style.fontWeightMedium.fontWeight,
        color: whiteColor,
        marginTop: 20,
    },
});

export default BiometricModal;
