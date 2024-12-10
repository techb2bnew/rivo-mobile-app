import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, Pressable, Modal, TouchableOpacity } from 'react-native';
import { grayColor, whiteColor, blackColor, mediumGray, redColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';;
import { EARNED_POINTS, SPENT_POINTS, WALLET } from '../constants/Constants';
import { FlatList } from 'react-native-gesture-handler';
import { CELEBRATION_ICON, FEATHER_ICON } from '../assests/images';
import WalletModal from '../components/modals/WalletModal';
const { flex, flexDirectionRow, alignJustifyCenter, resizeModeContain, resizeModeCover, justifyContentSpaceBetween, justifyContentCenter, borderRadius10, borderWidth1, textAlign, alignItemsCenter, justifyContentSpaceEvenly } = BaseStyle;

const WalletScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Earned");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionData, setTransactionData] = useState([])
  const [showAll, setShowAll] = useState(false);

  const data = [
    {
      id: 1, type: "Earned", points: 100, date: "10 Nov, 2024", description: "Purchased on Feathers", icon: FEATHER_ICON, transactionId: "432062451345",
      orderNumber: "#12345678",
    },
    {
      id: 2, type: "Spent", points: 30, date: "15 Nov, 2024", description: "Purchased on Feathers", icon: FEATHER_ICON, transactionId: "432062451345",
      orderNumber: "#12345678",
    },
    { id: 3, type: "Earned", points: 70, date: "19 Nov, 2024", description: "Birthday Month 🎉🥳🎂🎈", icon: CELEBRATION_ICON },
    { id: 4, type: "Spent", points: 50, date: "25 Nov, 2024", description: "Purchased on Feathers", icon: FEATHER_ICON },
    {
      id: 5, type: "Earned", points: 50, date: "28 Nov, 2024", description: "Purchased on Feathers", icon: FEATHER_ICON, transactionId: "432062451345",
      orderNumber: "#12345678",
    },
    { id: 6, type: "Earned", points: 50, date: "25 Nov, 2024", description: "Purchased on Feathers", icon: FEATHER_ICON },
    { id: 7, type: "Earned", points: 50, date: "25 Nov, 2024", description: "Purchased on Feathers", icon: FEATHER_ICON },
    { id: 8, type: "Earned", points: 50, date: "25 Nov, 2024", description: "Purchased on Feathers", icon: FEATHER_ICON },
    { id: 9, type: "Spent", points: 60, date: "25 Nov, 2024", description: "Purchased on Feathers", icon: FEATHER_ICON },
    { id: 10, type: "Spent", points: 30, date: "25 Nov, 2024", description: "Purchased on Feathers", icon: FEATHER_ICON },
    { id: 11, type: "Spent", points: 10, date: "25 Nov, 2024", description: "Purchased on Feathers", icon: FEATHER_ICON },

  ];

  useEffect(() => {
    setTransactionData(data);
  }, [])

  // const filteredData = transactionData.filter((item) =>
  //   activeTab === "Earned" ? item.type === "Earned" : item.type === "Spent"
  // );
  const filteredData = showAll
    ? transactionData
    : transactionData.filter((item) =>
      activeTab === "Earned" ? item.type === "Earned" : item.type === "Spent"
    );

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const renderTransaction = ({ item }) => (
    <Pressable style={[styles.transactionContainer, flexDirectionRow, alignItemsCenter]}
      onPress={() => openModal(item)}
    >
      <View style={[styles.iconContainer, alignJustifyCenter, borderWidth1]}>
        <Image source={item.icon} style={{ resizeMode: "contain", width: wp(10), height: wp(8) }} />
      </View>
      <View style={[flex]}>
        <Text style={styles.transactionType}>
          Points {item.type}{" "}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.points,
          { color: item.type === "Spent" ? redColor : blackColor },
        ]}
      >
        {item.points}
      </Text>
    </Pressable>
  );


  const handleTabChange = (tab) => {
    if (tab === "All") {
      setShowAll(true);
      setActiveTab(null); 
    } else {
      setShowAll(false);
      setActiveTab(tab); 
    }
  };
  return (
    <View style={[styles.container, flex]}>
      <View style={[{ width: wp(100), height: "auto", padding: spacings.large }, flexDirectionRow]}>
        <Pressable onPress={() => { navigation.goBack(); }}>
          <Ionicons name="arrow-back" size={30} color={blackColor} />
        </Pressable>
        <Text style={styles.headerText}>
          {WALLET}
        </Text>
      </View>
      <View style={[styles.tabs, flexDirectionRow, justifyContentSpaceEvenly]}>
        <TouchableOpacity
          style={[
            styles.tabButton, alignJustifyCenter, borderRadius10, borderWidth1,
            showAll && styles.activeTabButton,
          ]}
          onPress={() => handleTabChange("All")}
        >
          <Text
            style={[
              styles.tabText,
              showAll && styles.activeTabText,
            ]}
          >
            All Points
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton, alignJustifyCenter, borderRadius10, borderWidth1,
            activeTab === "Earned" && styles.activeTabButton,
          ]}
          onPress={() => handleTabChange("Earned")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Earned" && styles.activeTabText,
            ]}
          >
            {EARNED_POINTS}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton, alignJustifyCenter, borderRadius10, borderWidth1,
            activeTab === "Spent" && styles.activeTabButton,
          ]}
          onPress={() => handleTabChange("Spent")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Spent" && styles.activeTabText,
            ]}
          >
            {SPENT_POINTS}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={[styles.summary, flexDirectionRow, justifyContentSpaceBetween,alignItemsCenter]}>
        <View>
          <Text style={[styles.summaryMonth, { color: grayColor }]}>2024</Text>
          <Text style={[styles.summaryMonth]}>November</Text>
        </View>
        <Text style={styles.summaryPoints}>20,000 Points</Text>
      </View>

      {/* Info */}
      <Text style={[styles.infoText, textAlign]}>
        {showAll
          ? "You are seeing all transactions on Feathers"
          : activeTab === "Earned"
            ? "You are seeing earned transactions on Feathers"
            : "You are seeing spent transactions on Feathers"
        }
      </Text>

      <View style={styles.separator} />

      {/* Transactions */}
      <FlatList
        data={filteredData}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      />
      {modalVisible && <WalletModal
        visible={modalVisible}
        onClose={closeModal}
        transaction={selectedTransaction}
      />}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
  },
  headerText: {
    fontSize: style.fontSizeNormal2x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    color: blackColor,
    paddingHorizontal: spacings.large,
    paddingVertical: spacings.small
  },
  tabs: {
    padding: spacings.large,
  },
  tabButton: {
    paddingVertical: spacings.large,
    paddingHorizontal: spacings.xxLarge,
    width: 'auto',
    height: hp(6),
    borderColor: "#f0f0f0"
  },
  activeTabButton: {
    backgroundColor: blackColor,
  },
  tabText: {
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: blackColor,
  },
  activeTabText: {
    color: whiteColor,
  },
  summary: {
    padding: spacings.xxxxLarge,
    backgroundColor: "#f9f9f9",
  },
  summaryMonth: {
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
  },
  summaryPoints: {
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    color: blackColor,
  },
  infoText: {
    padding: spacings.xxxxLarge,
    fontSize: style.fontSizeSmall2x.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: blackColor,
  },
  separator: {
    width: wp(100),
    height: 1,
    backgroundColor: "#d9d9d9",
    marginBottom: spacings.large,
  },
  transactionsList: {
    // paddingHorizontal: 16,
  },
  transactionContainer: {
    // marginVertical: 8,
    padding: 16,
    // backgroundColor: "#f9f9f9",
  },
  iconContainer: {
    width: wp(15),
    height: wp(15),
    borderRadius: 50,
    backgroundColor: whiteColor,
    marginRight: spacings.xxxLarge,
    borderColor: blackColor,
  },
  transactionType: {
    fontSize: style.fontSizeNormal2x.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
  },
  points: {
    fontSize: style.fontSizeNormal2x.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
  },
  description: {
    fontSize: style.fontSizeNormal.fontSize,
    color: "#666",
    marginVertical: 4
  },
  date: {
    fontSize: style.fontSizeSmall1x.fontSize,
    color: "#aaa",
  },

});

export default WalletScreen;
