// import React, { useEffect, useState } from "react";
// import { View, Text, Image, Pressable, Modal, StyleSheet, Alert, Platform } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../utils';
// import { spacings, style } from '../../constants/Fonts';
// import { blackColor, blackOpacity7, whiteColor } from "../../constants/Color";
// import { FACE_ID_IMAGE, FINGERPRINT_IMAGE } from "../../assests/images";
// import ReactNativeBiometrics from 'react-native-biometrics';

// const BiometricModal = () => {
//     const [isModalVisible, setIsModalVisible] = useState(false);

//     useEffect(() => {
//         const checkBiometricConditions = async () => {
//             try {
//                 const userToken = await AsyncStorage.getItem('userToken'); // Check if user is logged in
//                 const firstLoginDone = await AsyncStorage.getItem('firstLoginCompleted'); // Check first login status

//                 if (userToken && firstLoginDone === "true") {
//                     // Show modal only if the user is logged in and it's not the first login
//                     setIsModalVisible(true);
//                 }
//             } catch (error) {
//                 console.error("Error in biometric condition check:", error);
//             }
//         };

//         checkBiometricConditions();
//     }, []);

//     const handleBiometricAuthentication = async () => {
//         const rnBiometrics = new ReactNativeBiometrics();

//         try {
//             const result = await rnBiometrics.simplePrompt({
//                 promptMessage: 'Authenticate with Biometrics',
//             });

//             if (result.success) {
//                 setIsModalVisible(false);
//             } else {
//                 Alert.alert('Failed', 'Biometric authentication failed');
//             }
//         } catch (error) {
//             Alert.alert('Error', 'Biometric authentication not available or canceled.');
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={isModalVisible}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <Pressable onPress={handleBiometricAuthentication}>
//                             <Image
//                                 source={Platform.OS === "android" ? FINGERPRINT_IMAGE : FACE_ID_IMAGE}
//                                 style={styles.biometricIcon}
//                             />
//                         </Pressable>
//                         <Text style={styles.biometricText}>Authenticate with Biometrics</Text>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: whiteColor,
//     },
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: blackOpacity7,
//         justifyContent: "flex-end",
//     },
//     modalContent: {
//         height: "25%",
//         backgroundColor: whiteColor,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         padding: 20,
//         alignItems: "center",
//     },
//     biometricIcon: {
//         width: wp(20),
//         height: hp(10),
//         marginBottom: spacings.large,
//         resizeMode: "contain",
//     },
//     biometricText: {
//         fontSize: style.fontSizeNormal.fontSize,
//         fontWeight: style.fontWeightMedium.fontWeight,
//         color: blackColor,
//         marginBottom: 20,
//     },
// });

// export default BiometricModal;
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

    // useEffect(() => {
    //     const checkBiometricConditions = async () => {
    //         try {
    //             const userToken = await AsyncStorage.getItem('userToken');
    //             const firstLoginDone = await AsyncStorage.getItem('firstLoginCompleted');

    //             if (userToken && firstLoginDone === "true") {
    //                 setIsModalVisible(true);
    //             }
    //         } catch (error) {
    //             console.error("Error in biometric condition check:", error);
    //         }
    //     };

    //     checkBiometricConditions();
    // }, []);

    // const handleBiometricAuthentication = async () => {
    //     const rnBiometrics = new ReactNativeBiometrics();

    //     try {
    //         const result = await rnBiometrics.simplePrompt({
    //             promptMessage: 'Authenticate with Biometrics',
    //         });

    //         if (result.success) {
    //             setIsBiometricModalVisible(false);
    //         } else {
    //             setTimeout(() => handleBiometricAuthentication(), 1000);
    //         }
    //     } catch (error) {
    //         setTimeout(() => handleBiometricAuthentication(), 1000);
    //     }
    // };
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
