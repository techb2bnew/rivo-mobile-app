import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList } from 'react-native';
import Header from '../components/Header';
import { blackColor, grayColor, whiteColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { BANNER_IMAGE } from '../assests/images';
import { useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { useFocusEffect } from '@react-navigation/native';
import { addNotification } from '../redux/actions';
import { triggerLocalNotification } from '../notificationService';
import LoaderModal from '../components/modals/LoaderModal';
const { flex, alignItemsCenter, flexDirectionRow, textAlign, alignJustifyCenter, borderRadius10, resizeModeContain, resizeModeCover, positionAbsolute } = BaseStyle;

const OfferScreen = ({ navigation }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const dispatch = useDispatch();
    const [offers, setOffers] = useState(null);
    const [loading, setLoading] = useState(true);



    const carouselItems = [
        {
            image: 'https://www.feathers.com.au/cdn/shop/files/feathers-boutique-black-friday-2024-20percent-off-everything-mob.jpg?v=1731557910&width=960',
            // caption: 'Luxury In Layers',
            // text: "50 - 70% Off"
        },
        {
            image: 'https://www.feathers.com.au/cdn/shop/files/feathers-boutique-collections-coats-jackets-kent-tailored-vest-camel.jpg?v=1731879643&width=800',
            caption: 'Luxury In Layers',
            text: "50 - 70% Off"
        },
        {
            image: 'https://s3-alpha-sig.figma.com/img/8797/d63a/61d5b03b0db98c346e470afc16996bf6?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=RPRA1P6azT-z7Gx7ALzwnUMlk2rdKdzQOGyyLXF1Y7w2CEPNDH1xgorRqFMXtsUdLWdcqarlsUO4csyyd7JbR9hj3ddAlPShhlvhJSOATV~TUCcjq58~2fbL8xfdvW7zTKRgd59HMQNxNMwVqd2U-eYiPFwIkYLdQNHsn0tKINUUBLvjheElkbyRDr4QyNCER2mb9qvPwx83fw621Eb2puFmuAyDNwBs1tGXv2yat7U6ibbfjFF6vi7ryKq5swMHdQ8vtoj5oMSF7kdjNzMjBtjwI98dOltK6SxQ6NPsVKReRYdSs-7P2dfUBVZllO2mVQQUN01co0tZXFZOK6elUg__',
            caption: 'Get All That You Covet',
            text: "50 - 70% Off"
        },
        {
            image: 'https://s3-alpha-sig.figma.com/img/b828/9898/ac3c94bc13b1b4c53e43dfbcf5e5ac76?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=eSmm-o8f7nG9~tg6UrQ2YsSXygjHd3JRf8~mJSgwOp3jyi9gLY~Z7MwybAnixxwM2W8Uauw670KXM-JicykW7druL59dx8VSc8AVoKlDmYKKNU2B-WpU3oA9y8kp171D4GWNsRadyD5hSjGM2bl2YCcwpbllyRO5-47Jm~FB-XtWRzpYxKHWuqVd9BwEUq8GoTpkz5bhCfx3PErXkPkiw-p-W6PwWTaGyHZlnpqsBOUvdCuozgshheLuaceD9T9XR41HDxKgxVg8-9k13O66zGmiRHt9QcwdyETklaRl8fQKTk5xdq6Lmz-5R4RT9yjU0FjEd~DusdsNGXrcwyprYA__',
            caption: 'Luxury In Layers',
            text: "50 - 70% Off"
        },
        {
            image: 'https://s3-alpha-sig.figma.com/img/017f/20a6/89863d5741599f3d16b9d2264c434d2c?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=VmT9rwqJ-F3dWT9~T1GIRZauYUeZRLmxYoZs6XU4TxYnTSvvZ4tAhWNwouglrN2kKLPP1xvfsi249N4gO6H8vSd3TzHzkzB66P0KRz6vz~6KnVv6-I58cD1Hhlr~E3pxsTrUcwtWlix3e29bW0NhJ6MUApf8RCuFa~jDrzPFXIIq8QEithxBwUQzq5WY5310nhEcKur234rurACz4kBSBRI-l-HWtlencgVL~d2qbZjv0mIvs~P7ipfNacKnhI74AYwaj5--fZv2MWBtLO4pFwEciwk6YVywKJ1DFsuXd89ve0guy1J2uONCu39opojkNwiZ9QXv2Dk1ZEeKC7QAog__',
            caption: 'Luxury In Layers',
            text: "50 - 70% Off"
        },

    ];

    const categories = [

        {
            id: '1',
            label: 'Shirts & Tops',
            image: 'https://www.feathers.com.au/cdn/shop/files/feathers-tops-retro-isla-shirt-pink-2.jpg?v=1707883960&width=700',
        },
        {
            id: '2',
            label: 'Pants',
            image: 'https://www.feathers.com.au/cdn/shop/files/feathers-boutique-pants-nadia-wide-leg-jeans-blue-5.jpg?v=1725856581&width=700',
        },
        {
            id: '3',
            label: 'Skirt',
            image: 'https://www.feathers.com.au/cdn/shop/files/feathers-dresses-night-fever-dress-black-1_d865dc12-6a84-4929-a8b9-f5fc8b2c02b7.jpg?v=1715573073&width=700',
        },
        {
            id: '4',
            label: 'Jackets',
            image: 'https://www.feathers.com.au/cdn/shop/files/feathers-jackets-dublin-jacket-beige-1.jpg?v=1707957777&width=700',
        },
        {
            id: '5',
            label: 'Leggi',
            image: 'https://www.feathers.com.au/cdn/shop/files/feathers-pants-velvet-basque-legging-black-5.jpg?v=1703049211&width=700',
        },
        {
            id: '6',
            label: 'Dresses',
            image: 'https://www.feathers.com.au/cdn/shop/files/feathers-boutique-dresses-harlyn-panelled-jersey-midi-dress-black-5.jpg?v=1730690327&width=700',
        },

    ];

    const renderCarouselItem = ({ item }) => (
        <View style={[alignItemsCenter]}>
            <Image source={{ uri: item.image }} style={styles.carouselImage} />
            <View style={styles.captionContainer}>
                <Text style={[textAlign, positionAbsolute, { bottom: 50, left: 35, right: 35, color: whiteColor }]}>{item.caption}</Text>
                <Text style={[styles.categoryLabel, textAlign, positionAbsolute, { bottom: 10, left: 35, right: 35 }]}>{item.text}</Text>
            </View>
        </View>
    );

    const fetchNotifications = () => {
        PushNotification.getDeliveredNotifications((deliveredNotifications) => {
            deliveredNotifications.forEach((notification) => {
                dispatch(addNotification({
                    identifier: notification.identifier,
                    title: notification.title,
                    body: notification.body,
                }));
            });
        });
    };

    const listenForPushNotifications = () => {
        messaging().onMessage(async (remoteMessage) => {
            // Check if notification is not already added by checking the identifier
            dispatch(addNotification({
                identifier: remoteMessage.messageId,
                title: remoteMessage.notification?.title || 'No Title',
                body: remoteMessage.notification?.body || 'No Body',
            }));
        });
    };

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch("https://rivo-admin-c5ddaab83d6b.herokuapp.com/api/proxy/offers?page=1&limit=10", {
                    method: "GET",
                    redirect: "follow",
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setOffers(result.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
            listenForPushNotifications();
        }, [])
    );


    return (
        <View style={[styles.container, flex]}>
            <Header navigation={navigation} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginVertical: spacings.large }}>
                    <Carousel
                        data={carouselItems}
                        renderItem={renderCarouselItem}
                        sliderWidth={wp(100)}
                        itemWidth={wp(100)}
                        onSnapToItem={(index) => setActiveSlide(index)}
                    />
                    <Pagination
                        dotsLength={carouselItems.length}
                        activeDotIndex={activeSlide}
                        containerStyle={styles.paginationContainer}
                        dotStyle={styles.dotStyle}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                    />
                </View>
                <Text style={[styles.sectionHeader, textAlign]}>Luxury In Layers</Text>
                <FlatList
                    data={offers}
                    horizontal
                    // keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.categories}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={[styles.categoryBox, borderRadius10]}>
                            <Image source={{ uri: item.fileUrl }} style={[styles.categoryImage, resizeModeCover, borderRadius10]} />
                            <View style={[styles.overlay, borderRadius10, alignJustifyCenter]}>
                                <Text style={[styles.categoryLabel, textAlign, positionAbsolute, { fontSize: style.fontSizeMedium.fontSize, }]}>{item.name}</Text>
                            </View>
                        </View>
                    )}
                />
                <View style={[{ width: "95%", height: hp(15), margin: spacings.large, alignItemsCenter }, borderRadius10]}>
                    <Image source={BANNER_IMAGE} style={[{ width: "100%", height: hp(15) }, borderRadius10]} />
                </View>
                {loading && (
                    <LoaderModal visible={loading} message="Please wait..." />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: whiteColor,
    },
    carouselImage: {
        width: "100%",
        height: hp(45),
    },
    categories: {
        paddingHorizontal: spacings.large,
    },
    categoryBox: {
        alignItems: "center",
        marginHorizontal: spacings.small,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    categoryImage: {
        width: wp(28),
        height: wp(28),
    },
    categoryLabel: {
        color: whiteColor,
        fontSize: style.fontSizeLarge2x.fontSize,
        fontWeight: style.fontWeightMedium.fontWeight,
        bottom: spacings.large,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    paginationContainer: {
        paddingVertical: spacings.large,
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: blackColor,
    },
    captionContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: 10,
        height: hp(45),
    },
    sectionHeader: {
        fontSize: style.fontSizeLarge1x.fontSize,
        fontWeight: style.fontWeightMedium.fontWeight,
        marginBottom: spacings.large
    },

});

export default OfferScreen;
