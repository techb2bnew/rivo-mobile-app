import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { blackColor, whiteColor } from '../constants/Color';

const FAQScreen = ({ navigation }) => {
    const [visibleAnswers, setVisibleAnswers] = useState({});

    const faqData = [
        { id: '1', question: 'What is the Loyalty Program?', answer: 'The Loyalty Program rewards you with points for every purchase, which can be redeemed for discounts.' },
        { id: '2', question: 'How can I check my loyalty points?', answer: 'You can check your loyalty points in the Profile or Dashboard section.' },
        { id: '3', question: 'How do I redeem my loyalty points?', answer: 'Loyalty points can be redeemed at checkout for discounts on your orders.' },
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
                <Text style={styles.question}>{item.question}</Text>
                <TouchableOpacity onPress={() => toggleAnswerVisibility(item.id)}>
                    <Icon
                        name={visibleAnswers[item.id] ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={blackColor}
                    />
                </TouchableOpacity>
            </View>
            {visibleAnswers[item.id] && <Text style={styles.answer}>{item.answer}</Text>}
        </View>
    );

    return (
        < View style={styles.container}>
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
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 10,
        backgroundColor: whiteColor,
        flex:1
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
        width:"99.8%",
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
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
});

export default FAQScreen;
