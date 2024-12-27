import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { blackColor, whiteColor } from '../constants/Color';
import { spacings } from '../constants/Fonts';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import LoaderModal from '../components/modals/LoaderModal';

const WebViewScreen = ({ route, navigation }) => {
    const { url } = route.params;
    const [loading, setLoading] = useState(false);

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <View style={{ width: wp(100), height: 'auto', padding: spacings.large }}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color={blackColor} />
                </Pressable>
            </View>

            {/* WebView */}
            <WebView
                source={{ uri: url }}
                style={styles.webview}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
            />

            {/* Loader Modal */}
            {loading && <LoaderModal visible={loading} message="Loading..." />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: whiteColor,
    },
    webview: {
        flex: 1,
    },
});

export default WebViewScreen;
