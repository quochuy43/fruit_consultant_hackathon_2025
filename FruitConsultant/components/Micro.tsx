import React, { useState, useRef, useEffect } from 'react';
import { Modal, Animated, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const Micro = () => {
    
    const [visible, setVisible] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Hiệu ứng nhấp nháy (pulse animation)
    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.3,
                    duration: 600,
                    useNativeDriver: true
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true
                })
            ])
        ).start();
    };

    const handlePickMicro = () => {
        setVisible(true);
        startPulse();
    };

    return (
        <>
            {/* Nút Micro */}
            <TouchableOpacity
                style={[styles.iconButton, styles.imageButton]}
                onPress={handlePickMicro}
            >
                <Ionicons name="mic" size={22} color="#fff" />
            </TouchableOpacity>

            {/* Popup Micro */}
            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    onPress={() => setVisible(false)}
                    activeOpacity={1}
                >
                    <Animated.View style={[styles.micContainer, { transform: [{ scale: scaleAnim }] }]}>
                        <Ionicons name="mic" size={80} color="#fff" />
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageButton: {
        backgroundColor: '#19c37d',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    micContainer: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: '#19c37d',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
