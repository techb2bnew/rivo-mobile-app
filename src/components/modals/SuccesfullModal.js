import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '.././../utils';
import { blackColor, redColor, whiteColor, blackOpacity5, grayColor } from '../../constants/Color';
import { spacings, style } from '../../constants/Fonts';
import { BaseStyle } from '../../constants/Style';
import { SUCCESS_ICON } from '../../assests/images';
const { textAlign, alignJustifyCenter, flex, borderRadius10, alignItemsCenter } = BaseStyle;

const SuccesfullModal = ({ visible, onClose, title, message, buttonLabel, onButtonPress }) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={[styles.modalContainer, flex, alignJustifyCenter]}>
                <View style={[styles.modalContent, borderRadius10, alignItemsCenter]}>
                   <Image source={SUCCESS_ICON} style={{width:wp(15),height:wp(15),resizeMode:"contain"}}/>
                    <Text style={styles.successTitle}>{title}</Text>
                    <Text style={[styles.successMessage, textAlign]}>{message}</Text>
                    <TouchableOpacity style={[styles.button, alignItemsCenter, borderRadius10]} onPress={onButtonPress}>
                        <Text style={styles.buttonText}>{buttonLabel}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: whiteColor,
        padding: spacings.Large2x,
        width: '90%',
    },
    successIcon: {
        fontSize: spacings.ExtraLarge4x,
        marginBottom: spacings.Large2x,
    },
    successTitle: {
        fontSize: spacings.Large2x,
        fontWeight: 'bold',
        marginBottom: spacings.xLarge,
    },
    successMessage: {
        fontSize: style.fontSizeNormal2x.fontSize,
        color: grayColor,
        marginBottom: spacings.Large2x,
    },
    button: {
        backgroundColor: blackColor,
        paddingVertical: spacings.xxLarge,
        width: '100%',
    },
    buttonText: {
        color: whiteColor,
        fontSize: style.fontSizeMedium.fontSize,
        fontWeight: style.fontWeightMedium.fontWeight,
    },
});

export default SuccesfullModal;
