import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, Pressable, Modal, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { grayColor, whiteColor, blackColor, mediumGray, redColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';;
import { EARNED_POINTS, SPENT_POINTS, WALLET } from '../constants/Constants';
import { FlatList } from 'react-native-gesture-handler';
import { CELEBRATION_ICON, FEATHER_ICON } from '../assests/images';
import WalletModal from '../components/modals/WalletModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderModal from '../components/modals/LoaderModal';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
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

  // console.log("waleet", selectedTransaction, modalVisible)

  const fetchWalletHistory = async (fromDate, toDate, transactionType) => {
    setTotalPoints('')
    setTransactionData([]);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setLoading(false)
        console.log("Token not found");
        return;
      }

      const url = new URL("https://publicapi.dev.saasintegrator.online/api/wallet-history");
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
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      // console.log("Result:", result.data.data);
      setTransactionData(result.data.data);
      const totalPoints = result.data.data.reduce((sum, transaction) => {
        // Convert points to a number before adding
        return sum + parseFloat(transaction.points);
      }, 0);
      // console.log(totalPoints)
      setTotalPoints(totalPoints.toFixed(2));
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
        console.log("Token not found");
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
  
      const url = `https://publicapi.dev.saasintegrator.online/api/wallet-detail/${walletHistoryId}`;
      console.log("Request URL:", url);
  
      // Fetch wallet details
      const response = await fetch(url, requestOptions);
      console.log("Response status:", response.status);
  
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
    // setLoading(true);
    setModalVisible(false)
    try {
      const walletDetail = await getWalletDetail(item.id);
      setSelectedTransaction({ ...walletDetail.data, item })
      setModalVisible(true);
      // console.log("Wallet Details Fetched:", walletDetail.data);
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

  useEffect(() => {
    console.log('loading:', loading);
    console.log('showBarcodeModal:', modalVisible);
  }, [loading, modalVisible]);

  const renderTransaction = ({ item }) => {
    // Function to format the date
    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      const day = date.getDate().toString().padStart(2, '0'); // Two-digit day
      const month = date.toLocaleString("en-US", { month: "short" }); // Short month name
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    };

    // Function to format the time
    const formatTime = (isoDate) => {
      const date = new Date(isoDate);
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const amPm = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM
      hours = hours % 12 || 12; // Convert to 12-hour format, ensuring 12 for 0 hours
      return `${hours}:${minutes} ${amPm}`; // 12-hour format with AM/PM
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
          {/* <Text style={styles.description}>
            {item?.transaction_type === "earned"
              ? "Purchase on Feathers"
              : item?.transaction_type === "redeemed"
                ? "Spent points on Feathers"
                : "Transaction on Feathers"}
          </Text> */}
          <Text style={styles.description}>
            {item?.adjustment_reason === "points_refunded"
              ? "Refunded points on Feathers"
              : item?.transaction_type === "earned"
                ? "Purchase on Feathers"
                : item?.transaction_type === "redeemed"
                  ? "Spent points on Feathers"
                  : "Transaction on Feathers"}
          </Text>
          <Text style={styles.date}>{`${formatDate(item.created_at)} ${formatTime(item.created_at)}`}</Text>
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

  const onRefresh = async () => {
    setRefreshing(true);
    fetchWalletHistory(activeTab);
    setRefreshing(false);
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
          <Text style={[styles.summaryMonth, { color: grayColor }]}>{currentYear}</Text>
          <Text style={[styles.summaryMonth]}>{currentMonth}</Text>
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
          // refreshControl={
          //   <RefreshControl
          //     refreshing={refreshing}
          //     onRefresh={onRefresh}
          //     colors={["#42A5F5"]}
          //     tintColor="#42A5F5"
          //   />
          // }
        />
      )}
      {loading && (
        // <View style={{
        //   position: "absolute",
        //   top: 0,
        //   left: 0,
        //   right: 0,
        //   bottom: 0,
        //   backgroundColor: "rgba(0, 0, 0, 0.5)",
        //   alignItems: "center",
        //   justifyContent: "center",
        //   zIndex: 9999,
        // }}>
        //   <View style={{
        //     width: 150,
        //     padding: 20,
        //     backgroundColor: "#fff",
        //     borderRadius: 10,
        //     alignItems: "center",
        //     justifyContent: "center",
        //   }}>
        //     <Text style={{
        //       marginBottom: 10,
        //       fontSize: 16,
        //       color: "#000",
        //     }}>
        //       Please wait...
        //     </Text>
        //     <ActivityIndicator size="large" color={"#42A5F5"} />
        //   </View>
        // </View>
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
  noTransactionsText: {
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    color: mediumGray, // or use any other color you prefer
    textAlign: 'center',
    paddingVertical: spacings.large,
  },

});

export default WalletScreen;
