import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { blackColor } from '../constants/Color';

const FAQScreen = ({ navigation }) => {
    const [faqData, setFaqData] = useState([]);

    // Fetch FAQ data when component mounts
    useEffect(() => {
        const fetchedData = [
            { id: '1', question: 'What is the Loyalty Program?', answer: 'Our Loyalty Program rewards you with points for every purchase. These points can be redeemed for discounts and other benefits.' },
            { id: '2', question: 'How can I check my loyalty points?', answer: 'You can check your loyalty points in the "Loyalty Points" section of your profile or dashboard.' },
            { id: '3', question: 'Where can I view my order history?', answer: 'Your order history can be accessed from the "Order History" tab . It displays all your past orders.' },
            { id: '4', question: 'What is my tier status?', answer: 'Your tier status indicates the level of benefits you receive. It can be checked in the tier tab, where you can see your current tier and progress towards the next tier.' },
            { id: '5', question: 'How do I redeem my loyalty points?', answer: 'You can redeem your loyalty points during checkout by selecting the "Use Points" option to apply a discount to your purchase.' },
        ];
        setFaqData(fetchedData);
    }, []);

    // Render Item
    const renderItem = ({ item }) => (
        <View style={styles.faqItem}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={blackColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQs</Text>
            </View>

            {/* FAQ List */}
            <FlatList
                data={faqData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.scrollContainer}
            />
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
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
    scrollContainer: {
        padding: 15,
    },
    faqItem: {
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#252837',
    },
    answer: {
        fontSize: 14,
        color: '#646E77',
        lineHeight: 20,
    },
});

export default FAQScreen;
