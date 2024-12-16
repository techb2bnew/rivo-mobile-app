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
const { flex, flexDirectionRow, alignJustifyCenter, resizeModeContain, resizeModeCover, justifyContentSpaceBetween, justifyContentCenter } = BaseStyle;

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [point, setPoint] = useState("");
  const [order, setOrder] = useState("")
  const [dob, setDob] = useState("");
  const [doa, setDoa] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');

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
  // useEffect(() => {
  //   setUserName("Olivia Smith");
  //   setPhoneNumber("+ 61 1245264810");
  //   setEmail("rivo@gmail.com");
  //   setPoint("2000");
  //   setOrder("12");
  //   setDoa("05th May,2020");
  //   setDob("06th Nov,1997");
  //   setImageUrl("https://s3-alpha-sig.figma.com/img/5933/2448/f48059d31c0669631b5ea41f6434a0d3?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Z8hOlHMFg2wDnOhLisKw5LVJredwB2mXdtbrVznL~oSR8AcMxUmhl~P-~EnP8MmoAf~qgAoyt-UcdQFyTYCt3FoAuVHjTfJfWrtK1O5zFaYKX8LoMx6Fu3zJcY3tk3syN5c0CXlvkJuC2t~kl2jeDgQHJ8hbzUwvyps3Z~8XCBC~Hc2RkENqpunEI-hv4H2ZhDR0aTz4DWXvaZHHLdLzchgS0DKsCF-I7XSKHQjgzktCnkHKIFUXcx0Y6X4LXy~cBCZIgTPARkI6VYOkoaBwialVueZj5i-3Pm7yIgznBRihrHGzIdFY4Eu2iNPCCaE-HJSvMTPzjLCStseGuieUCw__")
  // }, [])
  const renderAvatar = profileData?.data?.photo ? (
    <Image source={{ uri: profileData?.data?.photo }} style={[{ width: wp(23), height: "100%", borderRadius: 50 }]} />
  ) : (
    <View style={{ width: 80, height: 80, borderRadius: 50, backgroundColor: grayColor, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 40, color: '#fff' }}>{profileData?.data?.full_name?.charAt(0)}</Text>
    </View>
  );
  return (
    <View style={[styles.container, flex]}>

      <View style={{ width: wp(100), height: "auto", padding: spacings.large }}>
        <Pressable onPress={() => { navigation.goBack(); }}>
          <Ionicons name="arrow-back" size={30} color={blackColor} />
        </Pressable>
      </View>

      <View style={[{ width: wp(100), height: hp(15), padding: spacings.xxLarge }, flexDirectionRow]}>
        <View style={style.imageBox}>
          {/* <Image
            source={{ uri: imageUrl }}
            style={[{ width: wp(23), height: "100%", borderRadius: 50 }]}
          /> */}
          {renderAvatar}

        </View>
        <View style={[{ width: "100%", height: hp(13) }, justifyContentCenter]}>
          <Text style={styles.text}>{profileData?.data?.full_name}</Text>
        </View>
      </View>

      {profileData?.data?.phone != null && <View style={[{ width: wp(100), height: 'auto' }, flexDirectionRow]}>
        <View style={{ paddingLeft: spacings.xxLarge, paddingVertical: spacings.xLarge }}>
          <Feather name="phone" size={25} color={blackColor} />
        </View>
        <View style={{ paddingVertical: spacings.xxLarge }}>
          <Text style={[styles.text, { fontSize: style.fontSizeNormal.fontSize, }]}>{profileData?.data?.phone}</Text>
        </View>
      </View>}

      {profileData?.data?.email != null && <View style={[{ width: wp(100), height: 'auto' }, flexDirectionRow]}>
        <View style={{ paddingLeft: spacings.xxLarge }}>
          <Fontisto name="email" size={25} color={blackColor} />
        </View>
        <View>
          <Text style={[styles.text, { fontSize: style.fontSizeNormal.fontSize, }]}>{profileData?.data?.email}</Text>
        </View>
      </View>}

      <View style={[styles.pointBox, flexDirectionRow]}>
        {profileData?.data?.available_loyalty_points && <View style={[{ width: wp(50), height: "100%", borderRightColor: "#d9d9d9", borderRightWidth: 1 }, alignJustifyCenter]}>
          <Text style={[styles.text, { lineHeight: 20, fontSize: style.fontSizeLarge.fontSize }]}>{profileData?.data?.available_loyalty_points}</Text>
          <Text style={[styles.text, { fontSize: style.fontSizeNormal.fontSize, color: grayColor, fontWeight: style.fontWeightThin1x.fontWeight }]}>{POINTS}</Text>
        </View>}

        <View style={[{ width: wp(50), height: "100%" }, alignJustifyCenter]}>
          <Text style={[styles.text, { lineHeight: 20, fontSize: style.fontSizeLarge.fontSize }]}>12</Text>
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={"#42A5F5"} />
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
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
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: spacings.medium,
    fontSize: 16,
    color: blackColor,
  },

});

export default ProfileScreen;
