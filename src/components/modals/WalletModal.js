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
  if (!transaction || !visible) return null;

  const { points, id, orders, item } = transaction;


  console.log("transalction", transaction);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

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
            Points {item.transaction_type === "earned" ? "Earned" : "Spent"}
          </Text>
          <Text style={[styles.modalDescription, textAlign]}>
            {
              item?.adjustment_reason === "birthday"
                ? "Birthday points"
                : item?.adjustment_reason === "points_refunded"
                  ? "Refunded Points"
                  : item?.transaction_type === "earned"
                    ? "Purchased Points"
                    : item?.transaction_type === "redeemed"
                      ? "Spent Points "
                      : "Purchased Points"
            }
          </Text>
          <View style={{ paddingHorizontal: spacings.large, height: hp(6), alignItems: 'center', justifyContent: 'center', backgroundColor: blackColor, borderRadius: 10 }}>
            <Text style={styles.modalPoints}>{points} Points</Text>
          </View>
          <Text style={styles.modalDate}>{formatDate(item.created_at)}</Text>
          {
            (
              item.transaction_type != "redeemed" &&
              orders[0]?.uid
            )
            && <View style={styles.separator} />}
          {
            item.transaction_type != "redeemed" &&
            orders[0]?.uid &&
            <View style={[{ width: "100%", paddingVertical: 5 }, alignItemsCenter, flexDirectionRow]}>
              <View style={{ width: "44%" }}>
                <Text style={[styles.transactionDetails, { color: blackColor }]}>
                  Order Number
                </Text>
              </View>
              <View >
                <Text style={styles.transactionDetails}>
                  {orders[0]?.uid}
                </Text>
              </View>
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
    width: wp(90),
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
    color: blackColor,
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
    color: blackColor,
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
    color: "#1C1C1C",
    marginBottom: 5,
  },
});

export default WalletModal;
