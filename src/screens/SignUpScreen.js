import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import SuccesfullModal from '../components/modals/SuccesfullModal';
import { blackColor, grayColor, whiteColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import OTPTextInput from 'react-native-otp-textinput';
import { CONTINUE, ENTER_EMAIL_OR_PHONE, ENTER_THE_OTP_SEND_TO, GENERATE_OTP, MOBILE_OR_EMAIL, OTP_NOT_RECEIVED, OTP_VERIFICATION, RESEND_CODE, SUCCESSFULLY, VERIFICATION_SUCCESSFULL_MESSAGE } from '../constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { flex, alignItemsCenter, flexDirectionRow, textAlign, justifyContentCenter, borderRadius10, justifyContentSpaceBetween } = BaseStyle;

const SignUpScreen = ({ navigation }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateInputValue = () => {
    if (!inputValue.trim()) {
      setErrorMessage("This field is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    if (!emailRegex.test(inputValue) && !phoneRegex.test(inputValue)) {
      setErrorMessage("Please enter a valid email or phone number");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  // const validateInputValue = () => {
  //   if (!inputValue.trim()) {
  //     setErrorMessage("This field is required");
  //     return false;
  //   }
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const phoneRegex = /^\+?\d{10,15}$/;

  //   if (!phoneRegex.test(inputValue)) {
  //     setErrorMessage("Please enter a valid email or phone number");
  //     return false;
  //   }

  //   setErrorMessage("");
  //   return true;
  // };

  // Validate OTP
  
  const validateOtp = () => {
    if (!otp || otp.length < 4) {
      setErrorMessage('Please enter a valid 4-digit OTP.');
      return false;
    }
    return true;
  };

  const handleGenerateOtp = () => {
    if (validateInputValue()) {
      setErrorMessage('');
      setIsOtpSent(true);
    }
  };

  const handleOtpSubmit = () => {
    if (validateOtp()) {
      setErrorMessage('');
      setIsSuccessModalVisible(true);
    }
  };

  const handleContinue = async () => {
    setIsSuccessModalVisible(false);
    await AsyncStorage.setItem('userToken', "12345678");
    navigation.replace('TabNavigator');
  };

  // const handleLogout = async () => {
  //   await AsyncStorage.removeItem('userToken');
  //   navigation.navigate('Login'); // Redirect to login screen after logout
  // };

  const onPressResendCode = () => {
    console.log("clickedonPressResendCode")
  }

  return (
    <View style={[styles.container, flex]}>
      {!isOtpSent ? (
        <View style={[flex, justifyContentCenter]}>
          <Text style={[styles.title, textAlign]}>{ENTER_EMAIL_OR_PHONE}</Text>
          <Text style={{ marginBottom: spacings.large, marginTop: spacings.ExtraLarge }}>{MOBILE_OR_EMAIL}</Text>
          <View style={[styles.inputContainer, flexDirectionRow, alignItemsCenter, borderRadius10]}>
            {/* <Text style={styles.countryCode}>+61</Text> */}
            <TextInput
              style={[styles.textInput, flex]}
              placeholder={ENTER_EMAIL_OR_PHONE}
              keyboardType="default"
              value={inputValue}
              onChangeText={setInputValue}
            />
          </View>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <View style={{ marginTop: 40 }}>
            <CustomButton title={GENERATE_OTP} onPress={handleGenerateOtp} />
          </View>
        </View>
      ) : (
        <View style={[flex, justifyContentCenter]}>
          <Text style={[styles.title, textAlign]}>{OTP_VERIFICATION}</Text>
          <Text style={[styles.subtitle, textAlign,{width:wp(80)}]}>
            {ENTER_THE_OTP_SEND_TO} {inputValue}
          </Text>
          <View style={[styles.otpContainer, alignItemsCenter]}>
            <OTPTextInput
              inputCount={4}
              handleTextChange={setOtp}
              containerStyle={[styles.otpWrapper, flexDirectionRow, justifyContentSpaceBetween]}
              textInputStyle={[styles.otpInput, borderRadius10, textAlign]}
              tintColor={blackColor}
              offTintColor={grayColor}
            />
          </View>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <Text style={[styles.subtitle, textAlign,flexDirectionRow,{height:hp(2)}]}>
            {OTP_NOT_RECEIVED} ?
            <Pressable onPress={onPressResendCode} style={{ marginTop: spacings.large }}>
              <Text style={[styles.subtitle, textAlign, { color: blackColor, fontWeight: "600", textDecorationLine: "underline",height:hp(2) }]}> {RESEND_CODE}
              </Text>
            </Pressable>
          </Text>
          <View style={{ marginTop: spacings.ExtraLarge1x }}>
            <CustomButton title="Submit" onPress={handleOtpSubmit} />
          </View>
        </View>
      )}
      <SuccesfullModal
        visible={isSuccessModalVisible}
        onClose={() => setIsSuccessModalVisible(false)}
        title={SUCCESSFULLY}
        message={VERIFICATION_SUCCESSFULL_MESSAGE}
        buttonLabel={CONTINUE}
        onButtonPress={handleContinue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
    paddingHorizontal: spacings.Large2x,
  },
  title: {
    fontSize: style.fontSizeLarge3x.fontSize,
    fontWeight: style.fontWeightBold.fontWeight,

  },
  subtitle: {
    fontSize: style.fontSizeNormal2x.fontSize,
    color: grayColor,
    alignItems: "center",
    justifyContent:"center"
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: blackColor,
    paddingHorizontal: spacings.xLarge,
    marginBottom: spacings.Large2x,
  },
  countryCode: {
    fontSize: style.fontSizeNormal2x.fontSize,
    marginRight: spacings.small2x,
  },
  textInput: {
    height: hp(6),
    fontSize: style.fontSizeNormal2x.fontSize,
  },
  otpContainer: {
    marginVertical: spacings.xLarge,
  },
  otpWrapper: {
    marginTop: spacings.large,
  },
  otpInput: {
    width: wp(15),
    height: wp(15),
    fontSize: style.fontSizeLarge.fontSize,
    borderWidth: 1,
    borderColor: blackColor,
    backgroundColor: whiteColor,
  },
  errorText: {
    color: 'red',
    fontSize: style.fontSizeNormal.fontSize,
  },
});

export default SignUpScreen;
