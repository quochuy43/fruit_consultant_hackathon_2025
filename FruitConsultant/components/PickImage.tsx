import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";

type Sender = "user" | "bot" | "error";

interface Message {
    id: string;
    sender: Sender;
    text: string;
    image?: string;
    isPending?: boolean;
}
interface PendingImage {
    uri: string;
    file: {
        uri: string;
        name: string;
        type: string;
    };
}

export const PickImage = () => {
    const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);
    const [inputMessage, setInputMessage] = useState("");
    const handleImageUpload = async () => {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Cần quyền truy cập", "Vui lòng cấp quyền truy cập thư viện ảnh để tiếp tục.");
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });


            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const imageUri = asset.uri;
                const file = {
                    uri: imageUri,
                    name: asset.fileName || "image.jpg",
                    type: asset.mimeType || "image/jpeg",
                };

                setPendingImage({ uri: imageUri, file });

                const previewMsg: Message = {
                    // id: generateUniqueId(),
                    id: 'd',
                    sender: "user",
                    text: inputMessage.trim(),
                    image: imageUri,
                    isPending: true,
                };
            }
        } catch (error) {
            console.log("Lỗi chọn ảnh:", error);
            Alert.alert("Lỗi", "Không thể chọn ảnh vào lúc này.");
        }
    };
    return (
        <>
            <TouchableOpacity
                style={[
                    styles.iconButton,
                    styles.imageButton,
                    // pendingImage && styles.imageButtonActive,
                    // loading && styles.disabledButton,
                ]}
                onPress={handleImageUpload}
            // disabled={loading}
            >
                <Ionicons
                name={pendingImage ? 'image' : 'image-outline'}
                size={22}
                color={pendingImage ? '#ffffff' : '#ffffff'}
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
        backgroundColor: '#19c37d',
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