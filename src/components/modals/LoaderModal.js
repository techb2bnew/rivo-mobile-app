import React from "react";
import { Modal, View, Text, ActivityIndicator, StyleSheet } from "react-native";

const LoaderModal = ({ visible, message }) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
        >
            <View style={styles.modalContainer}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>{message ? message : "Please wait..."}</Text>
                    <ActivityIndicator size="large" color={"#42A5F5"} />
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
    loadingContainer: {
        width: 150,
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingText: {
        marginBottom: 10,
        fontSize: 16,
        color: "#000",
    },
});

export default LoaderModal;
