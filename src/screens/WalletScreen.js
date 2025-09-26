import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, Pressable, Modal, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { grayColor, whiteColor, blackColor, mediumGray, redColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';;
import { BASE_URL, EARNED_POINTS, SPENT_POINTS, WALLET } from '../constants/Constants';
import { FlatList } from 'react-native-gesture-handler';
import { CELEBRATION_ICON, FEATHER_ICON } from '../assests/images';
import WalletModal from '../components/modals/WalletModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderModal from '../components/modals/LoaderModal';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { resetToAuthStack } from '../NavigationService';
const { flex, flexDirectionRow, alignJustifyCenter, resizeModeContain, resizeModeCover, justifyContentSpaceBetween, justifyContentCenter, borderRadius10, borderWidth1, textAlign, alignItemsCenter, justifyContentSpaceEvenly } = BaseStyle;

const WalletScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionData, setTransactionData] = useState([]);
  const [totalPoints, setTotalPoints] = useState('');
  const [loading, setLoading] = useState(false);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "long" });
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    fetchWalletHistory("", "", "all");
  }, []);


  const fetchWalletHistory = async (fromDate, toDate, transactionType) => {
    setTotalPoints('')
    setTransactionData([]);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setLoading(false)
        console.log("Token not found");
        await resetToAuthStack();
        return;
      }

      const url = new URL(`${BASE_URL}/api/wallet-history`);
      url.searchParams.append("from_date", fromDate);
      url.searchParams.append("to_date", toDate);
      url.searchParams.append("transaction_type", transactionType);

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Accept", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const response = await fetch(url, requestOptions);
      console.log("Response Status:", response.status);
      if (response.status === 401) {
        await resetToAuthStack();
      }

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Result:", result.data.data);
      setTransactionData(result.data.data);
      if (transactionType === "all") {
        // Earned transactions ka total sum
        const earnedTotal = result.data.data
          .filter(transaction => transaction.transaction_type === "earned")
          .reduce((sum, transaction) => sum + parseFloat(transaction.points), 0);

        // Redeemed transactions ka total sum
        const redeemedTotal = result.data.data
          .filter(transaction => transaction.transaction_type === "redeemed")
          .reduce((sum, transaction) => sum + parseFloat(transaction.points), 0);

        // Final Balance (Earned - Redeemed)
        const finalBalance = earnedTotal - redeemedTotal;
        setTotalPoints(finalBalance.toFixed(2));
      } else {
        // Agar 'all' nahi hai toh sirf respective transactions ka sum calculate karein
        const totalPoints = result.data.data.reduce((sum, transaction) => {
          return sum + parseFloat(transaction.points);
        }, 0);

        setTotalPoints(totalPoints.toFixed(2));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching wallet history:", error);
    }
  };

  const handleTabChange = (tab) => {
    setModalVisible(false);
    setSelectedTransaction(null);
    setActiveTab(tab);
    const transactionType = tab === "All" ? "all" : tab === "Earned" ? "earned" : "spent";
    fetchWalletHistory("", "", transactionType);
    setModalVisible(false);
  };

  const getWalletDetail = async (walletHistoryId) => {
    console.log("Fetching wallet details for ID:", walletHistoryId);

    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        console.log('No authentication token found');
        await resetToAuthStack();
        return;
      }

      console.log("Token retrieved successfully");

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Accept", "application/json");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const url = `${BASE_URL}/api/wallet-detail/${walletHistoryId}`;
      console.log("Request URL:", url);

      // Fetch wallet details
      const response = await fetch(url, requestOptions);
      console.log("Response status:", response.status);
      if (response.status === 401) {
        await resetToAuthStack();
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Wallet details response:", JSON.stringify(data, null, 2));

      return data;
    } catch (error) {
      console.error("Error fetching wallet details:", error);
      throw error;
    }
  };


  const openModal = async (item) => {
    setModalVisible(false)
    try {
      const walletDetail = await getWalletDetail(item.id);
      setSelectedTransaction({ ...walletDetail.data, item })
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching wallet details:", error);
      setSelectedTransaction(null);
    } finally {
      setLoading(false)
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };


  const renderTransaction = ({ item }) => {
    // Function to format the date
    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      const day = date.getDate().toString().padStart(2, '0'); // Two-digit day
      const month = date.toLocaleString("en-US", { month: "short" }); // Short month name
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    };


    const formatTime = (isoDate) => {
      const date = new Date(isoDate); // Date object created directly from UTC time
      const hours = date.getUTCHours().toString().padStart(2, '0'); // Get UTC hours
      const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Get UTC minutes
      const amPm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM
      return `${hours}:${minutes} ${amPm}`;
    };




    return (
      <Pressable style={[styles.transactionContainer, flexDirectionRow, alignItemsCenter]}
        onPress={() => openModal(item)}
      >
        <View style={[styles.iconContainer, alignJustifyCenter, borderWidth1]}>
          <Image source={FEATHER_ICON} style={{ resizeMode: "contain", width: wp(10), height: wp(8) }} />
        </View>
        <View style={[flex]}>
          <Text style={styles.transactionType}>
            Points {capitalizeWords(item.transaction_type === "redeemed" ? "Spent" : item.transaction_type)}
          </Text>
          <Text style={styles.description}>
            {
              item?.adjustment_reason === "birthday"
                ? "Birthday Points"
                : item?.adjustment_reason === "points_refunded"
                  ? "Refunded Points"
                  : item?.transaction_type === "earned"
                    ? "Purchased Points"
                    : item?.transaction_type === "redeemed"
                      ? "Spent points"
                      : "Purchased Points"
            }
          </Text>
          <Text style={styles.date}>{`${formatDate(item?.loyalty_point_created_at ?? item?.created_at)} ${formatTime(item?.loyalty_point_created_at ?? item?.created_at)}`}</Text>
        </View>
        <Text
          style={[
            styles.points,
            { color: item.transaction_type === "redeemed" ? redColor : blackColor },
          ]}
        >
          {item.points}
        </Text>
      </Pressable>
    );
  };

  const TransactionSkeleton = () => {
    return (
      <ContentLoader
        speed={1.5}
        width={wp(90)}
        height={80}
        viewBox={`0 0 ${wp(90)} 80`}
        backgroundColor="#e0e0e0"
        foregroundColor="#f5f5f5"
      >
        {/* Icon */}
        <Circle cx={wp(10)} cy={40} r={wp(5)} />

        {/* Text placeholders */}
        <Rect x={wp(20)} y={15} rx={4} ry={4} width={wp(50)} height={12} />
        <Rect x={wp(20)} y={35} rx={4} ry={4} width={wp(50)} height={10} />
        <Rect x={wp(20)} y={55} rx={4} ry={4} width={wp(40)} height={10} />

        {/* Points */}
        <Rect x={wp(80)} y={25} rx={4} ry={4} width={wp(10)} height={15} />
      </ContentLoader>
    );
  };


  return (
    <View style={[styles.container, flex]}>
      <View style={[{ width: "100%", height: "auto", padding: 16 }, flexDirectionRow]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="#252837" />
        </Pressable>
        <Text style={styles.headerText}>Wallet</Text>
      </View>

      <View style={[styles.tabs, flexDirectionRow, justifyContentSpaceEvenly]}>
        {["All", "Earned", "Spent"].map((tab) => (
          <TouchableOpacity
            key={tab}

            style={[
              styles.tabButton, alignJustifyCenter, borderRadius10, borderWidth1,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => handleTabChange(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === "All" ? "All Points" : tab === "Earned" ? "Earned Points" : "Spent Points"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.summary, flexDirectionRow, justifyContentSpaceBetween, alignItemsCenter]}>
        <View>
          <Text style={[styles.summaryMonth]}>All Points</Text>

        </View>
        <Text style={styles.summaryPoints}>{totalPoints} Points</Text>
      </View>

      <Text style={[styles.infoText, textAlign]}>
        {activeTab === "All"
          ? "You are seeing all transactions on Feathers"
          : activeTab === "Earned"
            ? "You are seeing earned transactions on Feathers"
            : "You are seeing spent transactions on Feathers"}
      </Text>

      <View style={styles.separator} />

      {transactionData?.length === 0 && !loading ? (
        <Text style={styles.noTransactionsText}>No transactions available</Text>
      ) : (
        <FlatList
          data={transactionData}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.transactionsList}
          showsVerticalScrollIndicator={false}
        />
      )}
      {loading && (
        <View>
          {new Array(6).fill(null).map((_, index) => (
            <TransactionSkeleton key={index} />
          ))}
        </View>
      )}
      {modalVisible && selectedTransaction != null && !loading && (
        <WalletModal
          visible={modalVisible}
          onClose={handleCloseModal}
          transaction={selectedTransaction}
        />
      )}

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
    padding: 16,
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
  noTransactionsText: {
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    color: mediumGray, // or use any other color you prefer
    textAlign: 'center',
    paddingVertical: spacings.large,
  },

});

export default WalletScreen;
