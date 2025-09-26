import React from "react";
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, Pressable } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '.././../utils';
import { blackColor, redColor, whiteColor, grayColor, lightGrayOpacityColor } from '../../constants/Color';
import { spacings, style } from '../../constants/Fonts';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { DATE, EXPIRE_POINTS, POINT_EXPIRE } from "../../constants/Constants";
import { BaseStyle } from '../../constants/Style';
const { textAlign, alignJustifyCenter, flex, borderRadius10, alignItemsCenter, flexDirectionRow, justifyContentSpaceBetween } = BaseStyle;

const ExpirePointsModal = ({ visible, onClose, data, point }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options); // Example: "28 May 2025"
    };
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={[styles.modalContainer, flex, alignJustifyCenter]} >
                <View style={styles.modalContent}                >
                    {/* Header */}
                    <View style={[styles.modalHeader, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween]}>
                        <Text style={styles.modalTitle}>{POINT_EXPIRE}</Text>
                        <TouchableOpacity onPress={onClose} >
                            <Ionicons name="close-sharp" size={24} color={blackColor} />
                        </TouchableOpacity>
                    </View>

                    {/* Table Header */}
                    <View style={[styles.tableHeader, flexDirectionRow, justifyContentSpaceBetween]}>
                        <Text style={styles.headerText}>{DATE}</Text>
                        <Text style={styles.headerText}>Points</Text>
                    </View>



                    <View
                        style={[
                            styles.row,
                            justifyContentSpaceBetween,
                            flexDirectionRow
                        ]}
                    >
                        <Text style={styles.rowText}>{formatDate(data)}</Text>
                        <Text style={styles.rowText}>{point}</Text>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContent: {
        backgroundColor: whiteColor,
        width: "90%",
        maxHeight: hp(44),
        borderRadius: 15,
        padding: spacings.xxLarge,
    },
    modalHeader: {
        marginBottom: spacings.Large2x,
    },
    modalTitle: {
        fontSize: style.fontSizeLargeX.fontSize,
        fontWeight: style.fontWeightMedium1x.fontWeight,
        color: blackColor,
    },
    closeButton: {
        backgroundColor: redColor,
        padding: spacings.small,
        borderRadius: 20,
    },
    tableHeader: {
        paddingVertical: spacings.xLarge,
        borderBottomWidth: 1,
        borderBottomColor: lightGrayOpacityColor,
    },
    headerText: {
        fontSize: style.fontSizeNormal2x.fontSize,
        fontWeight: style.fontWeightMedium.fontWeight,
        color: blackColor,
    },
    row: {
        paddingVertical: spacings.xLarge,
        paddingHorizontal: spacings.small,
        borderRadius: 8,
    },
    rowText: {
        fontSize: style.fontSizeNormal.fontSize,
        color: grayColor,
        fontWeight: style.fontWeightThin1x.fontWeight,
    },
});

export default ExpirePointsModal;
