import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { blackColor, grayColor, whiteColor } from "../../constants/Color";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '.././../utils';
import { spacings, style } from '../../constants/Fonts';
import { BaseStyle } from '../../constants/Style';
const { textAlign, alignJustifyCenter, flex, borderRadius10, alignItemsCenter, justifyContentSpaceBetween, flexDirectionRow } = BaseStyle;

const WalletModal = ({ visible, onClose, transaction }) => {
  if (!transaction) return null;

  const { type, points, date, description, transactionId, orderNumber } =
    transaction;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={[styles.modalOverlay, flex, alignJustifyCenter]} onPress={onClose}>
        <View style={[styles.modalContent, borderRadius10, alignItemsCenter]}>
          <Text style={styles.modalTitle}>
            Points {type === "Earned" ? "Earned" : "Spent"}
          </Text>
          <Text style={[styles.modalDescription, textAlign]}>{description}</Text>
          <View style={{ width: wp(30), height: hp(6), alignItems: 'center', justifyContent: 'center', backgroundColor: blackColor, borderRadius: 10 }}>
            <Text style={styles.modalPoints}>{points} Points</Text>
          </View>
          <Text style={styles.modalDate}>{date}</Text>
          {(transactionId || orderNumber) && <View style={styles.separator} />}
          {transactionId &&
            <View style={[{ width: "90%" }, justifyContentSpaceBetween, alignItemsCenter, flexDirectionRow]}>
              <Text style={[styles.transactionDetails, { color: blackColor }]}>
                Transaction ID
              </Text>
              <Text style={styles.transactionDetails}>
                {transactionId}
              </Text>
            </View>
          }
          {orderNumber &&
            <View style={[{ width: "90%", paddingVertical: 5 }, justifyContentSpaceBetween, alignItemsCenter, flexDirectionRow]}>
              <Text style={[styles.transactionDetails, { color: blackColor }]}>
                Order Number
              </Text>
              <Text style={styles.transactionDetails}>
                {orderNumber}
              </Text>
            </View>}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: wp(85),
    backgroundColor: whiteColor,
    padding: spacings.xxxxLarge,
  },
  modalTitle: {
    fontSize: style.fontSizeMedium1x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    marginBottom: spacings.large,
  },
  modalDescription: {
    fontSize: style.fontSizeNormal.fontSize,
    color: grayColor,
    marginBottom: spacings.large,
  },
  modalPoints: {
    fontSize: style.fontSizeMedium1x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    marginVertical: spacings.large,
    color: whiteColor,
  },
  modalDate: {
    fontSize: style.fontSizeNormal.fontSize,
    color: grayColor,
    marginVertical: spacings.large,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#eee",
    marginVertical: spacings.large,
  },
  transactionDetails: {
    fontSize: style.fontSizeNormal.fontSize,
    color: grayColor,
    marginBottom: 5,
  },
});

export default WalletModal;
