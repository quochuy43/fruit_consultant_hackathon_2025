import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MessageProps {
    text: string;
    isUser: boolean;
}

export const Message: React.FC<MessageProps> = ({ text, isUser }) => {
    return (
        <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
            <View style={styles.avatarContainer}>
                {isUser ? (
                    <View style={styles.userAvatar}>
                        <Ionicons name="person" size={20} color="#fff" />
                    </View>
                ) : (
                    <View style={styles.aiAvatar}>
                        <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                    </View>
                )}
            </View>
            <View style={styles.messageContent}>
                <Text style={styles.messageText}>{text}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 16,
        width: '100%',
    },
    userContainer: {
        backgroundColor: '#f7f7f8',
    },
    aiContainer: {
        backgroundColor: '#fff',
    },
    avatarContainer: {
        marginRight: 12,
    },
    userAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#10a37f',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aiAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#19c37d',
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContent: {
        flex: 1,
        paddingTop: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#2d333a',
    },
});
