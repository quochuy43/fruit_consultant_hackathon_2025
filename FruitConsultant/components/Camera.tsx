import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";

interface PendingImage {
    uri: string;
    file: {
        uri: string;
        name: string;
        type: string;
    };
}

export const Camera = () => {





    const handleImageCapture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Quyền truy cập", "Cần quyền truy cập Camera để chụp ảnh.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({

            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled && result.assets?.[0]) {
            const asset = result.assets[0];
            const imageUri = asset.uri;
            const file = {
                uri: imageUri,
                name: asset.fileName || "photo.jpg",
                type: asset.mimeType || "image/jpeg",
            };
            console.log("Captured image file:", file);
            // setPendingImage({ uri: imageUri, file });

            // const previewMsg: Message = {
            //     id: generateUniqueId(),
            //     sender: "user",
            //     text: inputMessage.trim(),
            //     image: imageUri,
            //     isPending: true,
            // };

            // setMessages((prev) => [
            //     ...prev.filter((msg) => !msg.isPending),
            //     previewMsg,
            // ]);
        }
    };
    return (
        <>
            <TouchableOpacity
                style={[
                    styles.iconButton,
                    styles.imageButton,
                    true && styles.imageButtonActive,
                    true && styles.disabledButton,
                    // hasPendingImage && styles.imageButtonActive,
                    // loading && styles.disabledButton,
                ]}
                onPress={handleImageCapture}
            // disabled={loading}
            >
                <Ionicons
                    name={true ? 'camera' : 'camera-outline'}
                    size={22}
                    color={true ? '#ffffff' : '#2563eb'}
                // name={hasPendingImage ? 'image' : 'image-outline'}
                // size={22}
                // color={hasPendingImage ? '#ffffff' : '#2563eb'}
                />
            </TouchableOpacity>
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        gap: 8,
    },
    inputWrapper: {
        flex: 1,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#d1d5db',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        minHeight: 48,
        maxHeight: 120,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageButton: {
        borderWidth: 1,
        borderColor: '#2563eb',
        backgroundColor: '#EEF2FF',
    },
    imageButtonActive: {
        backgroundColor: '#2563eb',
    },
    sendButton: {
        backgroundColor: '#2563eb',
    },
    clearButton: {
        backgroundColor: '#E5E7EB',
    },
    disabledButton: {
        opacity: 0.5,
    },
});