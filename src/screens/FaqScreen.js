// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { blackColor } from '../constants/Color';

// const FAQScreen = ({ navigation }) => {
//     const [faqData, setFaqData] = useState([]);

//     // Fetch FAQ data when component mounts
//     useEffect(() => {
//         const fetchedData = [
//             { id: '1', question: 'What is the Loyalty Program?', answer: 'Our Loyalty Program rewards you with points for every purchase. These points can be redeemed for discounts and other benefits.' },
//             { id: '2', question: 'How can I check my loyalty points?', answer: 'You can check your loyalty points in the "Loyalty Points" section of your profile or dashboard.' },
//             { id: '3', question: 'Where can I view my order history?', answer: 'Your order history can be accessed from the "Order History" tab . It displays all your past orders.' },
//             { id: '4', question: 'What is my tier status?', answer: 'Your tier status indicates the level of benefits you receive. It can be checked in the tier tab, where you can see your current tier and progress towards the next tier.' },
//             { id: '5', question: 'How do I redeem my loyalty points?', answer: 'You can redeem your loyalty points during checkout by selecting the "Use Points" option to apply a discount to your purchase.' },
//         ];
//         setFaqData(fetchedData);
//     }, []);

//     // Render Item
//     const renderItem = ({ item }) => (
//         <View style={styles.faqItem}>
//             <Text style={styles.question}>{item.question}</Text>
//             <Text style={styles.answer}>{item.answer}</Text>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//                     <Icon name="arrow-back" size={24} color={blackColor} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>FAQs</Text>
//             </View>

//             {/* FAQ List */}
//             <FlatList
//                 data={faqData}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderItem}
//                 contentContainerStyle={styles.scrollContainer}
//                 showsVerticalScrollIndicator={false}
//             />
//         </View>
//     );
// };

// // Styles
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f9f9f9',
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 15,
//         paddingHorizontal: 20,
//     },
//     backButton: {
//         marginRight: 15,
//     },
//     headerTitle: {
//         color: blackColor,
//         fontSize: 20,
//         fontWeight: 'bold',
//     },
//     scrollContainer: {
//         padding: 15,
//     },
//     faqItem: {
//         marginBottom: 20,
//         padding: 20,
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 6,
//         elevation: 4,
//     },
//     question: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 10,
//         color: '#252837',
//     },
//     answer: {
//         fontSize: 14,
//         color: '#646E77',
//         lineHeight: 20,
//     },
// });

// export default FAQScreen;
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { blackColor } from '../constants/Color';

const FAQScreen = () => {
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
                        color="#42A5F5"
                    />
                </TouchableOpacity>
            </View>
            {visibleAnswers[item.id] && <Text style={styles.answer}>{item.answer}</Text>}
        </View>
    );

    return (
        <>
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
        </>
    );
};

const styles = StyleSheet.create({
    container: {
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
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
