import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Message } from '@/components/Message';
import { ChatInput } from '@/components/ChatInput';
import { Sidebar } from '@/components/Sidebar';
import { useSidebar } from '@/hooks/useSidebar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.80;

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
}

export default function HomeScreen() {
  const { isOpen, openSidebar, closeSidebar } = useSidebar();
  const translateX = useSharedValue(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Xin chào bạn, tôi là trợ lý AI. Tôi có thể giúp gì cho bạn?',
      isUser: false,
    },
  ]);

  // Sync translateX with sidebar open/close
  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(SIDEBAR_WIDTH, { duration: 300 });
    } else {
      translateX.value = withTiming(0, { duration: 250 });
    }
  }, [isOpen]);

  const handleSend = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'This is a sample response. Your AI integration will go here!',
        isUser: false,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  // Edge swipe gesture to open sidebar
  const edgeSwipeGesture = Gesture.Pan()
    .activeOffsetX([0, 30])
    .onUpdate((event) => {
      if (event.translationX > 50 && event.x < 50 && !isOpen) {
        // Swipe from left edge
        openSidebar();
      }
    });

  // Animated style for main content
  const mainContentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Animated style for overlay
  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: translateX.value / SIDEBAR_WIDTH * 0.3,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Sidebar */}
      <Sidebar visible={isOpen} onClose={closeSidebar} translateX={translateX} />

      {/* Main Content */}
      <GestureDetector gesture={edgeSwipeGesture}>
        <Animated.View style={[styles.mainContent, mainContentAnimatedStyle]}>
          <SafeAreaView style={styles.safeArea}>

            <View style={styles.header}>
              <TouchableOpacity onPress={openSidebar} style={styles.menuButton}>
                <Ionicons name="menu" size={28} color="#2d333a" />
              </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
              style={styles.content}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
              <ScrollView
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
              >
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    text={message.text}
                    isUser={message.isUser}
                  />
                ))}
              </ScrollView>
              <ChatInput onSend={handleSend} />
            </KeyboardAvoidingView>
          </SafeAreaView>

          {/* Overlay */}
          {isOpen && (
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={closeSidebar}
            >
              <Animated.View style={[styles.overlayBackground, overlayAnimatedStyle]} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // borderBottomWidth: 1,
    // borderBottomColor: '#e5e5ea',
    backgroundColor: '#fff',
  },
  menuButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    flexGrow: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
});
