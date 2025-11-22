import React, { useState, useRef, useEffect } from "react";
import {
    Modal,
    Animated,
    TouchableOpacity,
    StyleSheet,
    View,
    Text
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const Micro: React.FC = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const [seconds, setSeconds] = useState<number>(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Pulse animation
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

    // Timer start
    const startTimer = () => {
        setSeconds(0);
        intervalRef.current = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
    };

    // Timer stop
    const stopTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const handlePickMicro = () => {
        setVisible(true);
        startPulse();
        startTimer();
    };

    const handleClose = () => {
        setVisible(false);
        stopTimer();
    };

    // Format mm:ss
    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? "0" + s : s}`;
    };

    return (
        <>
            {/* Nút micro (ẩn icon khi đang thu) */}
            <TouchableOpacity
                style={[styles.iconButton, styles.imageButton]}
                onPress={handlePickMicro}
            >
                {visible ? (
                    <Text style={styles.timerText}>{formatTime(seconds)}</Text>
                ) : (
                    <Ionicons name="mic" size={22} color="#fff" />
                )}
            </TouchableOpacity>

            {/* Popup Micro */}
            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={handleClose}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={handleClose}
                    activeOpacity={1}
                >
                    <Animated.View
                        style={[
                            styles.micContainer,
                            { transform: [{ scale: scaleAnim }] }
                        ]}
                    >
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
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    timerText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    imageButton: {
        backgroundColor: "#19c37d"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center"
    },
    micContainer: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: "#19c37d",
        justifyContent: "center",
        alignItems: "center"
    }
});
