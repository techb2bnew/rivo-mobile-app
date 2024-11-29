import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Pressable } from "react-native";
import { blackColor, mediumGray, redColor, whiteColor } from "../constants/Color";
import { FEATHER_LOGO_IMAGE, FINGERPRINT_IMAGE } from "../assests/images";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import CustomButton from "../components/CustomButton";
import { BIOMETRIC, ENTER_EMAIL_OR_PHONE, LOGIN, LOGIN_TO_ACCESS, MOBILE_OR_EMAIL } from "../constants/Constants";
const { flex, alignItemsCenter, flexDirectionRow, alignJustifyCenter, borderRadius10, resizeModeContain, textAlign, justifyContentSpaceBetween } = BaseStyle;

const LoginScreen = () => {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");

    const validateInput = () => {
        if (!inputValue.trim()) {
            setError("This field is required");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?\d{10,15}$/;

        if (!emailRegex.test(inputValue) && !phoneRegex.test(inputValue)) {
            setError("Please enter a valid email or phone number");
            return false;
        }

        setError("");
        return true;
    };

    const handleLogin = async () => {
        if (validateInput()) {
            await AsyncStorage.setItem('userToken', "12345678");
            navigation.replace('TabNavigator');
        }
    };
    return (
        <View style={styles.container}>
            <View style={[alignJustifyCenter]}>
                <Image
                    source={FEATHER_LOGO_IMAGE}
                    style={{ resizeMode: "contain", width: wp(30) }}
                />
            </View>
            <View style={[{ width: "100%", height: hp(30), marginTop: hp(10), marginBottom: hp(5) }, alignJustifyCenter]}>
                <Text style={[styles.loginTitle, textAlign]}>{LOGIN}</Text>
                <Text style={[styles.loginSubtitle, textAlign]}>
                    {LOGIN_TO_ACCESS}
                </Text>
                <View style={{ width: "100%" }}>
                    <Text style={styles.inputLabel}>{MOBILE_OR_EMAIL}</Text>
                    <TextInput
                        style={[styles.input, error ? styles.errorInput : null]}
                        placeholder={ENTER_EMAIL_OR_PHONE}
                        placeholderTextColor={mediumGray}
                        keyboardType="default"
                        value={inputValue}
                        onChangeText={(text) => setInputValue(text)}
                        onBlur={validateInput}
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                </View>
            </View>
            <CustomButton title={LOGIN} onPress={handleLogin} />
            <View style={[styles.separatorContainer, flexDirectionRow, alignItemsCenter]}>
                <View style={[styles.separatorLine, flex]} />
                <Text style={styles.separatorText}>Or</Text>
                <View style={[styles.separatorLine, flex]} />
            </View>

            <View style={[styles.biometricButton, alignJustifyCenter, borderRadius10]}>
                <Pressable>
                    <Image
                        source={FINGERPRINT_IMAGE}
                        style={[styles.biometricIcon, resizeModeContain]}
                    />
                </Pressable>
                <Text style={styles.biometricText}>{BIOMETRIC}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
        padding: 20,
    },
    loginTitle: {
        fontSize: style.fontSizeLarge3x.fontSize,
        fontWeight: style.fontWeightMedium.fontWeight,
        marginBottom: spacings.large,
    },
    loginSubtitle: {
        fontSize: style.fontSizeNormal.fontSize,
        color: mediumGray,
        marginBottom: spacings.Large1x,
        width: wp(70)
    },
    inputLabel: {
        fontSize: style.fontSizeNormal.fontSize,
        marginBottom: spacings.large,
        color: blackColor,
    },
    input: {
        borderWidth: 1,
        borderColor: mediumGray,
        borderRadius: 8,
        padding: 12,
        marginBottom: spacings.Large1x,
        fontSize: 16,
        width: "100%",
        color: blackColor
    },
    separatorContainer: {
        marginVertical: hp(5),
    },
    separatorLine: {
        height: 1,
        backgroundColor: mediumGray,
    },
    separatorText: {
        marginHorizontal: 10,
        color: blackColor,
    },
    biometricButton: {
        height: hp(15),
        backgroundColor: "#F5F5F5",
        padding: spacings.xxxxLarge,
    },
    biometricIcon: {
        width: wp(20),
        height: hp(7),
        marginVertical: spacings.large,
    },
    biometricText: {
        fontSize: style.fontSizeNormal.fontSize,
        fontWeight: style.fontWeightMedium.fontWeight,
        color: blackColor,
    },
    errorText: {
        color: redColor,
        fontSize: style.fontSizeNormal.fontSize,

    },
});

export default LoginScreen;
