import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import Barcode from 'react-native-barcode-svg';
import { blackColor, redColor, whiteColor, blackOpacity5, grayColor } from '../../constants/Color';
import { spacings, style } from '../../constants/Fonts';
import { BaseStyle } from '../../constants/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '.././../utils';

const { textAlign, alignJustifyCenter, flex, borderRadius10, alignItemsCenter } = BaseStyle;
const BarcodeModal = ({ isVisible, data, onClose }) => {
    if (!data || !data.points) return null;

    // console.log("Barcode Data:", data.points);

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={[styles.modalOverlay, flex, alignJustifyCenter]} onPress={onClose}>
                <View style={[styles.modalContainer, borderRadius10, alignItemsCenter]}>
                    <View style={[{ padding: spacings.large, width: "100%" }, alignJustifyCenter]}>
                        <Text style={styles.modalName}>{data.name}</Text>
                        <Text style={styles.modalMembership}>{data.title}</Text>
                        <Text style={styles.modalCardNumber}>{data.points}</Text>
                    </View>
                    {/* Barcode */}
                    <View style={{ width: "100%", backgroundColor: whiteColor,alignItems:'center' }}>
                        <View style={[styles.barcodeContainer, alignJustifyCenter]}>
                            <Barcode
                                value={data.points}
                                format="CODE128"
                                height={100}
                                width={2}
                                lineColor="#000"
                                background="#fff"
                                displayValue={true} 
                            />
                        </View>

                        {/* <Text style={[styles.modalAdditionalNumber, textAlign]}>
                            {"data.additionalNumber"}
                        </Text> */}
                    </View>

                    {/* Close Button */}
                    {/* <Pressable onPress={onClose}>
                        <Text style={styles.closeButton}>Close</Text>
                    </Pressable> */}
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        backgroundColor: "#1c1c1c",
    },
    modalContainer: {
        width: '90%',
        backgroundColor: "#1c1c1c",
        borderWidth: 1,
        borderColor: whiteColor,
        overflow: 'hidden'
    },
    modalName: {
        fontSize: style.fontSizeLargeX.fontSize,
        fontWeight: 'bold',
        marginBottom: spacings.small,
        color: whiteColor
    },
    modalMembership: {
        fontSize: style.fontSizeNormal2x.fontSize,
        color: whiteColor,
        marginBottom: spacings.large,
    },
    modalCardNumber: {
        fontSize: style.fontSizeNormal2x.fontSize,
        marginBottom: 20,
        color: whiteColor
    },
    barcodeContainer: {
        margin: 20,
        width: '90%',
        height: hp(15),
        paddingHorizontal: spacings.large,
    },
    modalAdditionalNumber: {
        fontSize: style.fontSizeNormal.fontSize,
        color: blackColor,
        marginBottom: 20,
    },
    closeButton: {
        color: '#ff4d4d',
        marginTop: 10,
        fontWeight: 'bold',
    },
});

export default BarcodeModal;
