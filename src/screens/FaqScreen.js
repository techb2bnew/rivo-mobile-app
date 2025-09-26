import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { blackColor, whiteColor } from '../constants/Color';

const FAQScreen = ({ navigation }) => {
    const [visibleAnswers, setVisibleAnswers] = useState({});

    const faqData = [
        {
            id: '1',
            question: 'How do your garments fit?',
            answer: 'For best fit, we recommend referring to individual product details for sizing, as fit can vary between our styles. You may also use our size chart found here.',
            link: "https://www.feathers.com.au/pages/size-chart"
        },
        {
            id: '2',
            question: 'How do I subscribe?',
            answer: 'To subscribe to the Feathers Boutique mailing list, follow this link.',
            link: "https://www.feathers.com.au/pages/sign-up"
        },
        {
            id: '3',
            question: 'How often will I receive emails?',
            answer: 'Feathers sends out regular communications detailing product offerings and news. We strive not to overload our customers with information too frequently; however, you can choose to unsubscribe from these updates whenever you like.'
        },
        {
            id: '4',
            question: 'Can I cancel my online shop order?',
            answer: 'If your order has been processed and completed, you cannot cancel your online order. Please wait until your order arrives and follow the Returns Policy to initiate your return.'
        },
        {
            id: '5',
            question: 'How do I change my order?',
            answer: 'If your order has been processed and completed, you cannot change your online purchase. Please wait until your item arrives, follow the Returns Policy to return your item, and then re-purchase your preferred items.',
            link: "https://www.feathers.com.au/pages/refund-policy"

        },
        {
            id: '6',
            question: 'I have seen something I like in-store but can’t find it in the Online Shop. What should I do?',
            answer: 'Not all Feathers garments may be available to purchase online. Email us at online@feathers.com.au, and we will endeavor to track down the item for you.'
        },
        {
            id: '7',
            question: 'Can I purchase online gift vouchers?',
            answer: 'We are currently unable to process online gift vouchers. To purchase gift vouchers, please visit one of our boutiques.'
        },
        {
            id: '8',
            question: 'Do you accept cheque or money order?',
            answer: 'Unfortunately, we do not accept cheques or money orders for any online purchases.'
        },
        {
            id: '9',
            question: 'Do you ship to international destinations?',
            answer: 'Yes, Feathers Online offers international shipping to many destinations. For international orders, including shipping quotes, please email us at online@feathers.com.au with your postal address and any other details.'
        },
        {
            id: '10',
            question: 'How much is shipping?',
            answer:
                'Feathers Online uses Australia Post for all domestic and international deliveries.\n\n' +
                '**Domestic Shipping:**\n' +
                '- Standard Shipping: $10 (via Australia Post Standard Shipping), expected delivery in 5-7 business days.\n' +
                '- Express Shipping: $15, expected delivery in 1-4 business days.\n' +
                '- *Note:* The above rates apply to parcels up to 3kg. If an order exceeds 3kg, you will be contacted with additional shipping options.\n\n' +
                '**International Shipping:**\n' +
                '- New Zealand: $20 (up to 2kg). Orders over 2kg will be contacted for additional shipping options.\n' +
                '- Other Countries: $30 (up to 1kg). Orders over 1kg will be contacted for additional shipping options.'
        },
        {
            id: '11',
            question: 'How do I make a return?',
            answer: 'To make a return or exchange, please follow these steps:\n1. Log in to the account section and select Account History.\n2. Select the order that corresponds to the item you would like to return or exchange.\n3. Select the Request Return button, fill out the fields, and submit the form.\n4. Feathers will then contact you with more details to complete the return or exchange.\nIf you have any issues with the returns process, please email us at online@feathers.com.au or call toll-free at 1800 800 670.'
        },
        {
            id: '12',
            question: 'What is the Feathers Return Policy?',
            answer: 'Feathers will provide a refund for online purchases provided they are returned within 14 days of purchase, unwashed and unworn, in their original condition with all tags in place with a completed Returns Slip. Please note that items that are marked down as final sale cannot be refunded.',
            link: "https://www.feathers.com.au/pages/refund-policy"

        },
        {
            id: '13',
            question: 'How do I know what size I am?',
            answer: 'To help with your sizing, Feathers recommend referring to our Sizing Chart. We carry Australian Women’s Sizing usually ranging from XS to XL or XXL. Generally, the sizing conversions are as follows:\n\n' +
                '- XS - Australian women’s size 8\n' +
                '- S - Australian women’s size 10\n' +
                '- M - Australian women’s size 12\n' +
                '- L - Australian women’s size 14\n' +
                '- XL - Australian women’s size 16\n' +
                '- XXL - Australian women’s size 18\n\n' +
                'When considering sizing, sometimes cuts and fabric composition should be taken into account to allow for stretch and other factors. Every body is unique and every style is slightly different. For specific sizing enquiries, please do not hesitate to contact us at online@feathers.com.au.'
        }
    ];



    const toggleAnswerVisibility = (id) => {
        setVisibleAnswers(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const renderFAQItem = ({ item }) => (
        <View style={styles.faqItem}>
            <View style={styles.faqHeader}>
                <Text style={styles.question} numberOfLines={3}>{item.question}</Text>
                <TouchableOpacity onPress={() => toggleAnswerVisibility(item.id)} style={styles.iconWrapper}>
                    <Icon
                        name={visibleAnswers[item.id] ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={blackColor}
                    />
                </TouchableOpacity>
            </View>
            {visibleAnswers[item.id] && (
                <View>
                    <Text style={styles.answer}>{item.answer}</Text>

                    {/* Render link if available */}
                    {item.link && (
                        <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
                            <Text style={styles.linkText}>{item.link}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={blackColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQs</Text>
            </View>
            <FlatList
                data={faqData}
                renderItem={renderFAQItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 15, }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 10,
        backgroundColor: whiteColor,
        flex: 1
    },
    faqItem: {
        marginBottom: 10,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        flex: 1,
        flexShrink: 1,
        marginRight: 10,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    iconWrapper: {
        alignSelf: 'flex-start',
        // padding: 5,
    },
    answer: {
        fontSize: 14,
        color: '#646E77',
        lineHeight: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: blackColor,
        fontSize: 20,
        fontWeight: 'bold',
    },
    linkText: {
        marginTop: 10,
        fontSize: 14,
        color: '#007bff', // Blue color for link
        textDecorationLine: 'underline',
    },
});

export default FAQScreen;
