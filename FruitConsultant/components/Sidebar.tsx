import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.80;

interface Chat {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
}

interface SidebarProps {
    visible: boolean;
    onClose: () => void;
    translateX: SharedValue<number>;
}

export const Sidebar: React.FC<SidebarProps> = ({ visible, onClose, translateX }) => {
    // Sample data
    const [chats] = React.useState<Chat[]>([
        {
            id: '1',
            title: 'Tư vấn sầu riêng',
            lastMessage: 'Sầu riêng nào tốt nhất cho sức khỏe?',
            timestamp: '10:30',
        },
        {
            id: '2',
            title: 'Chọn sầu riêng',
            lastMessage: 'Cách chọn sầu riêng',
            timestamp: 'Hôm qua',
        },
        {
            id: '3',
            title: 'Bảo quản sầu riêng',
            lastMessage: 'Cách bảo quản sầu riêng',
            timestamp: '2 ngày trước',
        },
    ]);

    // Swipe 
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationX < 0) {
                const newValue = SIDEBAR_WIDTH + event.translationX;
                translateX.value = Math.max(0, newValue);
            }
        })
        .onEnd((event) => {
            if (event.translationX < -SIDEBAR_WIDTH / 3 || event.velocityX < -500) {
                translateX.value = withTiming(0, { duration: 250 });
                runOnJS(onClose)();
            } else {
                translateX.value = withTiming(SIDEBAR_WIDTH, { duration: 200 });
            }
        });

    const sidebarAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value - SIDEBAR_WIDTH }],
    }));

    if (!visible) return null;

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.sidebar, sidebarAnimatedStyle]}>
                {/* Search */}
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <Ionicons
                            name="search"
                            size={20}
                            color="#8e8e93"
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                            placeholderTextColor="#8e8e93"
                        />
                    </View>
                    <TouchableOpacity style={styles.newChatButton}>
                        <Ionicons name="create-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Chat List */}
                <ScrollView
                    style={styles.chatList}
                    contentContainerStyle={styles.chatListContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.sectionTitle}>Cuộc trò chuyện</Text>
                    {chats.map((chat) => (
                        <TouchableOpacity
                            key={chat.id}
                            style={styles.chatItem}
                            activeOpacity={0.7}
                        >
                            <View style={styles.chatIconContainer}>
                                <Ionicons
                                    name="chatbubble-outline"
                                    size={20}
                                    color="#19c37d"
                                />
                            </View>
                            <View style={styles.chatInfo}>
                                <Text style={styles.chatTitle} numberOfLines={1}>
                                    {chat.title}
                                </Text>
                                <Text
                                    style={styles.chatLastMessage}
                                    numberOfLines={1}
                                >
                                    {chat.lastMessage}
                                </Text>
                            </View>
                            <Text style={styles.chatTimestamp}>{chat.timestamp}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Profile/Settings */}
                <View style={styles.bottomSection}>
                    <TouchableOpacity style={styles.bottomButton}>
                        <Ionicons name="settings-outline" size={24} color="#2d333a" />
                        <Text style={styles.bottomButtonText}>Cài đặt</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.profileButton}>
                        <View style={styles.profileAvatar}>
                            <Ionicons name="person" size={24} color="#fff" />
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>Sầu Riêng</Text>
                            <Text style={styles.profileEmail}>saurieng@gmail.com</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#8e8e93" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: '#fff',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    // Search Section 
    searchSection: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5ea',
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f7',
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#2d333a',
    },
    newChatButton: {
        backgroundColor: '#19c37d',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#19c37d',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    // Chat List 
    chatList: {
        flex: 1,
    },
    chatListContent: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8e8e93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 12,
        marginBottom: 4,
    },
    chatIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    chatInfo: {
        flex: 1,
        marginRight: 8,
    },
    chatTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d333a',
        marginBottom: 4,
    },
    chatLastMessage: {
        fontSize: 14,
        color: '#8e8e93',
    },
    chatTimestamp: {
        fontSize: 12,
        color: '#8e8e93',
    },
    // Profile/Settings
    bottomSection: {
        borderTopWidth: 1,
        borderTopColor: '#e5e5ea',
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 24,
    },
    bottomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 8,
    },
    bottomButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2d333a',
        marginLeft: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e5ea',
        marginVertical: 8,
    },
    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    profileAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#19c37d',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d333a',
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 14,
        color: '#8e8e93',
    },
});
