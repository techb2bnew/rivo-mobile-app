import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, Modal, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
import { spacings, style } from '../../constants/Fonts';
import { blackColor, blackOpacity7, whiteColor } from "../../constants/Color";
import { FINGERPRINT_IMAGE } from "../../assests/images";
import ReactNativeBiometrics from 'react-native-biometrics';

const BiometricModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const checkBiometricConditions = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken'); // Check if user is logged in
                const firstLoginDone = await AsyncStorage.getItem('firstLoginCompleted'); // Check first login status

                if (userToken && firstLoginDone === "true") {
                    // Show modal only if the user is logged in and it's not the first login
                    setIsModalVisible(true);
                }
            } catch (error) {
                console.error("Error in biometric condition check:", error);
            }
        };

        checkBiometricConditions();
    }, []);

    const handleBiometricAuthentication = async () => {
        const rnBiometrics = new ReactNativeBiometrics();

        try {
            const result = await rnBiometrics.simplePrompt({
                promptMessage: 'Authenticate with Biometrics',
            });

            if (result.success) {
                setIsModalVisible(false); 
            } else {
                Alert.alert('Failed', 'Biometric authentication failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Biometric authentication not available or canceled.');
        }
    };

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Pressable onPress={handleBiometricAuthentication}>
                            <Image
                                source={FINGERPRINT_IMAGE}
                                style={styles.biometricIcon}
                            />
                        </Pressable>
                        <Text style={styles.biometricText}>Authenticate with Biometrics</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: whiteColor,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: blackOpacity7,
        justifyContent: "flex-end",
    },
    modalContent: {
        height: "25%",
        backgroundColor: whiteColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignItems: "center",
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
        color: blackColor,
        marginBottom: 20,
    },
});

export default BiometricModal;
