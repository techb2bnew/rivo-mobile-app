import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { grayColor, whiteColor, blackColor, redColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Feather from 'react-native-vector-icons/dist/Feather';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import { DOA, DOB, ORDERS, POINTS } from '../constants/Constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoaderModal from '../components/modals/LoaderModal';
import { useSelector } from 'react-redux';
const { flex, flexDirectionRow, alignJustifyCenter, resizeModeContain, resizeModeCover, justifyContentSpaceBetween, justifyContentCenter } = BaseStyle;

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderLength = useSelector((state) => state.order.orderLength);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        // console.log(token)
        if (!token) {
          setError('Token not found');
          setLoading(false);
          return;
        }

        // Make the API call with the token
        const response = await axios.get('https://publicapi.dev.saasintegrator.online/api/profile', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        if (response.data.success) {
          // console.log("profiledata", response.data)
          setProfileData(response.data)
          await AsyncStorage.setItem('currentPoints', profileData?.data?.available_loyalty_points);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const renderAvatar = profileData?.data?.photo ? (
    <Image source={{ uri: profileData?.data?.photo }} style={[{ width: wp(23), height: "100%", borderRadius: 50 }]} />
  ) : (
    <View style={{ width: 80, height: 80, borderRadius: 50, backgroundColor: grayColor, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 40, color: '#fff' }}>{profileData?.data?.full_name?.charAt(0).toUpperCase()}</Text>
    </View>
  );

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <View style={[styles.container, flex]}>

      <View style={{ width: wp(100), height: "auto", padding: spacings.large }}>
        <Pressable onPress={() => { navigation.goBack(); }}>
          <Ionicons name="arrow-back" size={30} color={blackColor} />
        </Pressable>
      </View>

      <View style={[{ width: wp(100), height: hp(15), padding: spacings.xxLarge }, flexDirectionRow]}>
        <View style={[, alignJustifyCenter]}>
          {/* <Image
            source={{ uri: imageUrl }}
            style={[{ width: wp(23), height: "100%", borderRadius: 50 }]}
          /> */}
          {renderAvatar}

        </View>
        <View style={[{ width: "100%", height: hp(11.5) }, justifyContentCenter]}>
          <Text style={styles.text}>{capitalizeWords(profileData?.data?.full_name)}</Text>
        </View>
      </View>

      {profileData?.data?.phone != null && <View style={[{ width: wp(100), height: 'auto' }, flexDirectionRow]}>
        <View style={{ paddingLeft: spacings.xxLarge, paddingVertical: spacings.xLarge }}>
          <Feather name="phone" size={25} color={blackColor} />
        </View>
        <View style={{ paddingVertical: spacings.xxLarge }}>
          <Text style={[styles.text, { fontSize: style.fontSizeNormal.fontSize, paddingTop: 5 }]}>{profileData?.data?.phone}</Text>
        </View>
      </View>}

      {profileData?.data?.email != null && <View style={[{ width: wp(100), height: 'auto' }, flexDirectionRow]}>
        <View style={{ paddingLeft: spacings.xxLarge }}>
          <Fontisto name="email" size={25} color={blackColor} />
        </View>
        <View>
          <Text style={[styles.text, { fontSize: style.fontSizeNormal.fontSize, paddingTop: 5 }]}>{profileData?.data?.email}</Text>
        </View>
      </View>}

      <View style={[styles.pointBox, flexDirectionRow]}>
        {profileData?.data?.available_loyalty_points && <View style={[{ width: wp(50), height: "100%", borderRightColor: "#d9d9d9", borderRightWidth: 1 }, alignJustifyCenter]}>
          <Text style={[styles.text, { lineHeight: 20, fontSize: style.fontSizeLarge.fontSize }]}>{profileData?.data?.available_loyalty_points}</Text>
          <Text style={[styles.text, { fontSize: style.fontSizeNormal.fontSize, color: grayColor, fontWeight: style.fontWeightThin1x.fontWeight }]}>{POINTS}</Text>
        </View>}

        <View style={[{ width: wp(50), height: "100%" }, alignJustifyCenter]}>
          <Text style={[styles.text, { lineHeight: 20, fontSize: style.fontSizeLarge.fontSize }]}>{orderLength}</Text>
          <Text style={[styles.text, { fontSize: style.fontSizeNormal.fontSize, color: grayColor, fontWeight: style.fontWeightThin1x.fontWeight }]}>{ORDERS}</Text>
        </View>
      </View>

      {profileData?.data?.birthday && <View style={[{ width: wp(100), height: 'auto', padding: spacings.xxLarge, borderBottomWidth: 1, borderBottomColor: "#d9d9d9" }, flexDirectionRow, justifyContentSpaceBetween]}>
        <View>
          <Text style={[styles.text]}>{DOB}</Text>
        </View>
        <View>
          <Text style={[styles.text, { fontSize: style.fontSizeNormal.fontSize, color: grayColor, fontWeight: style.fontWeightThin1x.fontWeight }]}>{profileData?.data?.birthday}</Text>
        </View>
      </View>}

      {profileData?.data?.date_of_anniversary && <View style={[{ width: wp(100), height: 'auto', padding: spacings.xxLarge, borderBottomWidth: 1, borderBottomColor: "#d9d9d9" }, flexDirectionRow, justifyContentSpaceBetween]}>
        <View>
          <Text style={[styles.text,]}>{DOA}</Text>
        </View>
        <View>
          <Text style={[styles.text, { fontSize: style.fontSizeNormal.fontSize, color: grayColor, fontWeight: style.fontWeightThin1x.fontWeight }]}>{profileData?.data?.date_of_anniversary}</Text>
        </View>
      </View>}
      {loading && (
        <LoaderModal visible={loading} message="Please wait..." />
      )}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteColor,
  },
  imageBox: {
    width: wp(30),
    height: hp(13)
  },
  text: {
    fontSize: style.fontSizeNormal2x.fontSize,
    fontWeight: style.fontWeightMedium.fontWeight,
    color: blackColor,
    paddingHorizontal: spacings.large
  },
  pointBox: {
    width: wp(100),
    height: hp(12),
    marginTop: spacings.large,
    borderTopColor: "#d9d9d9",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#d9d9d9"
  },
});

export default ProfileScreen;
