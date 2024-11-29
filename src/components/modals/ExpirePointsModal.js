import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '.././../utils';
import { blackColor, redColor, whiteColor, grayColor, lightGrayOpacityColor } from '../../constants/Color';
import { spacings } from '../../constants/Fonts';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const ExpirePointsModal = ({ visible, onClose, data }) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Expire Points</Text>
                        <TouchableOpacity onPress={onClose} >
                            <Ionicons name="close-sharp" size={24} color={blackColor} />
                        </TouchableOpacity>
                    </View>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerText}>Date</Text>
                        <Text style={styles.headerText}>Points Expire</Text>
                    </View>

                    {/* List */}
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View
                                style={[
                                    styles.row,
                                ]}
                            >
                                <Text style={styles.rowText}>{item.date}</Text>
                                <Text style={styles.rowText}>{item.points}</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: whiteColor,
        width: "90%",
        height: hp(45),
        borderRadius: 15,
        padding: 15,
        shadowColor: blackColor,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: blackColor,
    },
    closeButton: {
        backgroundColor: redColor,
        padding: 5,
        borderRadius: 20,
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: lightGrayOpacityColor,
    },
    headerText: {
        fontSize: 16,
        fontWeight: "600",
        color: blackColor,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 8,
    },
    rowText: {
        fontSize: 14,
        color: grayColor,
        fontWeight: "500",
    },
});

export default ExpirePointsModal;
