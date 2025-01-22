import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import CustomButton from '../components/CustomButton';
import SuccesfullModal from '../components/modals/SuccesfullModal';
import { blackColor, grayColor, whiteColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import OTPTextInput from 'react-native-otp-textinput';
import { CONTINUE, ENTER_EMAIL_OR_PHONE, ENTER_THE_OTP_SEND_TO, GENERATE_OTP, MOBILE_OR_EMAIL, OTP_NOT_RECEIVED, OTP_VERIFICATION, RESEND_CODE, SUCCESSFULLY, VERIFICATION_SUCCESSFULL_MESSAGE, CONNECTION_ID } from '../constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { triggerLocalNotification } from '../notificationService';
import LoaderModal from '../components/modals/LoaderModal';
const { flex, alignItemsCenter, flexDirectionRow, textAlign, justifyContentCenter, borderRadius10, justifyContentSpaceBetween } = BaseStyle;

const SignUpScreen = ({ navigation }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [authtoken, setAuthToken] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0); // Countdown state
  const [isResendEnabled, setIsResendEnabled] = useState(true);

  // Timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setIsResendEnabled(true); // Enable resend button after timer ends
    }

    return () => clearInterval(timer); // Cleanup interval
  }, [countdown]);

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

  const validateOtp = () => {
    if (!otp || otp.length < 6) {
      setErrorMessage('Please enter a valid 6-digit OTP.');
      return false;
    }
    return true;
  };

  const handleGenerateOtp = () => {
    // Validate the input value before proceeding
    if (!validateInputValue()) {
      return; // Exit if validation fails
    }

    let payload = {
      email: null,
      phoneNumber: null,
      deliveryMethod: null,
    };

    // Determine whether the input is an email or phone number
    if (inputValue.includes("@")) {
      payload.email = inputValue.trim();
      payload.deliveryMethod = "email";
    } else {
      payload.phoneNumber = inputValue.startsWith("+91")
        ? inputValue.trim()
        : `+91${inputValue.trim()}`;
      payload.deliveryMethod = "sms";
    }

    setLoading(true);

    // Prepare headers for the API request
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Create request options
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: "follow",
    };
    console.log("payload", JSON.stringify(payload));

    // Send the OTP request
    fetch("https://rivo-admin-c5ddaab83d6b.herokuapp.com/api/sendOtp", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        console.log("result::", result);
        if (result.success) {
          setIsOtpSent(true);
          setErrorMessage("");
          setAuthToken(result.authToken);
          console.log("OTP sent successfully:", result);
        } else {
          setErrorMessage(result.message || "Failed to send OTP.");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error generating OTP:", error);
        setErrorMessage("An error occurred while sending OTP.");
      });
  };

  // const handleGenerateOtp = () => {
  //   // Validate the input value before proceeding
  //   if (!validateInputValue()) {
  //     return; // Exit if validation fails
  //   }
  //   let contactData;
  //   if (inputValue.includes("@")) {
  //     contactData = inputValue;
  //   } else {
  //     contactData = inputValue.startsWith("+91")
  //       ? inputValue
  //       : `+91${inputValue}`;
  //   }
  //   setLoading(true);
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   const raw = JSON.stringify({
  //     contact: contactData.trim(),
  //     connection_id: CONNECTION_ID,
  //   });

  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow",
  //   };

  //   fetch("https://publicapi.dev.saasintegrator.online/api/check-contact", requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       setLoading(false);
  //       if (result.success) {
  //         setIsOtpSent(true);
  //         setErrorMessage("");
  //         setToken(result.data.token);
  //         console.log("OTP sent successfully:", result);

  //       } else {
  //         setErrorMessage(result.message || "Failed to send OTP.");
  //       }
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       console.error("Error generating OTP:", error);
  //       setErrorMessage("An error occurred while sending OTP.");
  //     });
  // };

  // const handleOtpSubmit = async () => {
  //   // Validate OTP first
  //   if (validateOtp()) {
  //     setLoading(true);
  //     console.log("otpinputValue", otp);

  //     // Use the API to verify OTP
  //     const myHeaders = new Headers();
  //     myHeaders.append("Authorization", `Bearer ${authtoken}`);
  //     myHeaders.append("Content-Type", "application/json");

  //     const raw = JSON.stringify({
  //       otp: otp, // Use OTP entered by user
  //     });

  //     const requestOptions = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: "follow",
  //     };

  //     try {
  //       const response = await fetch("https://publicapi.dev.saasintegrator.online/api/verify-otp", requestOptions);
  //       const result = await response.json();

  //       if (result.success) {
  //         setLoading(false);
  //         // OTP verified successfully
  //         setIsSuccessModalVisible(true);

  //         setErrorMessage('');
  //       } else {
  //         // OTP verification failed
  //         setLoading(false);
  //         setErrorMessage(result.message || 'Failed to verify OTP.');
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //       console.error("Error verifying OTP:", error);
  //       setErrorMessage("An error occurred while verifying OTP.");
  //     }
  //   }
  // };


  const handleOtpSubmit = async () => {
    if (!validateOtp()) {
      return; // Exit if validation fails
    }

    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const payload = {
      authToken: authtoken,
      otp: otp.trim(),
    };

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(payload),
      redirect: "follow",
    };

    try {
      const response = await fetch("https://rivo-admin-c5ddaab83d6b.herokuapp.com/api/verifyOtp", requestOptions);
      const result = await response.json();
      setLoading(false);
      if (result.apiData.success) {
        Keyboard.dismiss();
        setIsSuccessModalVisible(true);
        setToken(result.apiData.data.token);
        setErrorMessage("");
        console.log("OTP verification successful:", result);
      } else {
        setErrorMessage(result.apiData.message || "Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error verifying OTP:", error);
      setErrorMessage("Failed to verify OTP. Please try again.");
    }
  };

  useEffect(() => {
    console.log("isSuccessModalVisible updated:", isSuccessModalVisible);
  }, [isSuccessModalVisible]);


  const handleContinue = async () => {
    await AsyncStorage.setItem("userToken", token);
    navigation.replace('TabNavigator');
    // triggerLocalNotification("Welcome!", "Welcome to the app");
    setIsSuccessModalVisible(false);
  };

  const onPressResendCode = () => {
    if (countdown === 0) {
      setCountdown(30);
      setIsResendEnabled(false);
    }
    handleGenerateOtp();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
                placeholderTextColor={grayColor}
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
            <Text style={[styles.subtitle, textAlign, { width: wp(80) }]}>
              {ENTER_THE_OTP_SEND_TO} {inputValue}
            </Text>
            <View style={[styles.otpContainer, alignItemsCenter]}>
              <OTPTextInput
                inputCount={6}
                handleTextChange={setOtp}
                containerStyle={[styles.otpWrapper, flexDirectionRow, justifyContentSpaceBetween]}
                textInputStyle={[styles.otpInput, borderRadius10, textAlign]}
                tintColor={blackColor}
                offTintColor={grayColor}
              />
            </View>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <View style={{ flexDirection: "row", alignSelf: 'center', marginTop: spacings.xxLarge }}>
              <Text style={[styles.subtitle, textAlign, flexDirectionRow, { height: hp(3.5) }]}>
                {OTP_NOT_RECEIVED} ?
              </Text>
              {countdown > 0 ? (
                <Text style={styles.timerText}> Resend OTP in {countdown}s</Text>
              ) : (
                <Pressable onPress={onPressResendCode} disabled={!isResendEnabled}>
                  <Text style={[styles.subtitle, textAlign, { color: blackColor, fontWeight: "800", textDecorationLine: "underline", }]}>
                    {RESEND_CODE}
                  </Text>
                </Pressable>
              )}
            </View>
            <View style={{ marginTop: spacings.ExtraLarge1x }}>
              <CustomButton title="Submit" onPress={handleOtpSubmit} />
            </View>
          </View>
        )}
        {loading && (
          <View style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}>
            <View style={{
              width: 150,
              padding: 20,
              backgroundColor: "#fff",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={{
                marginBottom: 10,
                fontSize: 16,
                color: "#000",
              }}>
                Please wait...
              </Text>
              <ActivityIndicator size="large" color={"#42A5F5"} />
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

    </KeyboardAvoidingView>
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
    width: wp(80),
    textAlign: "center"
  },
  subtitle: {
    fontSize: style.fontSizeNormal2x.fontSize,
    color: grayColor,
    alignItems: "center",
    justifyContent: "center"
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: blackColor,
    paddingHorizontal: spacings.xLarge,
    // marginBottom: spacings.Large2x,
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
    marginTop: spacings.xLarge,
  },
  otpWrapper: {
    marginTop: spacings.large,
  },
  otpInput: {
    width: wp(13),
    height: wp(13),
    fontSize: style.fontSizeLarge.fontSize,
    borderWidth: 1,
    borderColor: blackColor,
    backgroundColor: whiteColor,
  },
  errorText: {
    color: 'red',
    fontSize: style.fontSizeNormal.fontSize,
  }
});

export default SignUpScreen;
