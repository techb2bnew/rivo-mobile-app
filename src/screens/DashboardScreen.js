import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { grayColor, whiteColor, blackColor, lightGrayColor, mediumGray } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { COIN_IMAGE, SALARY_IMAGE, SHEET_IMAGE, STAR_IMAGE } from '../assests/images';
import ExpirePointsModal from '../components/modals/ExpirePointsModal';
const { flex, alignItemsCenter, flexDirectionRow, alignJustifyCenter, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute, justifyContentSpaceBetween, textAlign } = BaseStyle;

const DashBoardScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const data = [
        {
            id: '1',
            title: 'Points Earned',
            points: '1000PT',
            backgroundColor: "#f5f5f5",
            textColor: blackColor,
            subtextColor: mediumGray,
            imageBackground: "#e6e6e6",
            icon: SALARY_IMAGE,
        },
        {
            id: '2',
            title: 'Points Balance',
            points: '600PT',
            backgroundColor: "#1c1c1c",
            textColor: whiteColor,
            subtextColor: whiteColor,
            imageBackground: whiteColor,
            icon: COIN_IMAGE,
        },
        {
            id: '3',
            title: 'Points Spent',
            points: '400PT',
            backgroundColor: "#f5f5f5",
            textColor: blackColor,
            subtextColor: mediumGray,
            imageBackground: "#e6e6e6",
            icon: STAR_IMAGE
        },
        {
            id: '4',
            title: 'Tier Status',
            points: 'Bronze',
            backgroundColor: "#1c1c1c",
            textColor: whiteColor,
            subtextColor: whiteColor,
            imageBackground: whiteColor,
            icon: SHEET_IMAGE
        },
    ];

    const expirydata = [
        { date: "20/12/2023", points: "5,00,000" },
        { date: "02/02/2024", points: "10,00,000" },
        { date: "05/06/2024", points: "20,000" },
        { date: "20/12/2023", points: "5,00,000" },
        { date: "20/12/2023", points: "5,00,000" },
        { date: "20/12/2023", points: "5,00,000" },
        { date: "20/12/2023", points: "5,00,000" },
        { date: "20/12/2023", points: "5,00,000" },
        { date: "20/12/2023", points: "5,00,000" },
    ];

    const renderItem = ({ item }) => (
        <Pressable style={[styles.card, { backgroundColor: item.backgroundColor }, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween, borderRadius10]}>
            <View>
                <Text style={[styles.pointsText, { color: item.textColor }]}>{item.points}</Text>
                <Text style={[styles.subText, { color: item.subtextColor }]}>{item.title}</Text>
            </View>
            <View style={[styles.iconBox, borderRadius10, { backgroundColor: item.imageBackground }, alignJustifyCenter]}>
                <Image source={item.icon} style={[styles.icon, resizeModeContain]} />
            </View>
        </Pressable>
    );

    return (
        <View style={[styles.container, flex]}>
            <Header navigation={navigation} />
            <View style={styles.separator} />
            {/* <Pressable style={[styles.card, { backgroundColor: "#1c1c1c",marginHorizontal:spacings.large }, flexDirectionRow, alignItemsCenter, justifyContentSpaceBetween, borderRadius10]}>
                <View>
                    <Text style={[styles.pointsText, { color: whiteColor }]}>{"item.points"}</Text>
                    <Text style={[styles.subText, { color: whiteColor }]}>{"item.title"}</Text>
                </View>
                <View style={[styles.iconBox, borderRadius10, { backgroundColor: whiteColor }, alignJustifyCenter]}>
                    <Image source={COIN_IMAGE} style={[styles.icon, resizeModeContain]} />
                </View>
            </Pressable> */}
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            />
            {/* <TouchableOpacity
                style={[styles.expirePointsButton, alignJustifyCenter, positionAbsolute]}
                onPress={() => setModalVisible(true)}
            >
                <View style={[{ width: "100%", height: "100%", backgroundColor: '#000', borderRadius: 50 }, alignJustifyCenter]}>
                    <Text style={[styles.expirePointsText, textAlign]}>Expire Points</Text>
                </View>
            </TouchableOpacity> */}

            {modalVisible && <ExpirePointsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                data={expirydata}
            />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: whiteColor,
    },
    separator: {
        width: wp(100),
        height: 1,
        backgroundColor: "#d9d9d9",
        marginBottom: spacings.large,
    },
    content: {
        paddingHorizontal: spacings.large,
    },
    card: {
        padding: 15,
        marginVertical: spacings.large,
    },
    pointsText: {
        fontSize: style.fontSizeMedium1x.fontSize,
        fontWeight: style.fontWeightMedium1x.fontWeight,
    },
    subText: {
        fontSize: style.fontSizeNormal.fontSize,
        marginTop: spacings.small,
    },
    iconBox: {
        width: wp(21),
        height: hp(9.5),
    },
    icon: {
        width: wp(15),
        height: hp(7)
    },
    expirePointsButton: {
        width: wp(20),
        height: wp(20),
        borderRadius: 50,
        backgroundColor: whiteColor,
        bottom: hp(3),
        right: wp(5),
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 5,
        borderWidth: 5,
        borderColor: "#000",
        padding: 2
    },
    expirePointsText: {
        color: whiteColor,
        fontSize: 14,
        fontWeight: '600'
    },
});

export default DashBoardScreen;
