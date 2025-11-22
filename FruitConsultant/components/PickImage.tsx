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

export const PickImage = () => {

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

                // XỬ LÝ CHO ANDROID: Android đôi khi trả về fileName = null
                // Chúng ta tự lấy tên file từ đường dẫn URI nếu cần
                const uri = asset.uri;
                const fileName = asset.fileName || uri.split('/').pop() || "image.jpg";

                // Lấy đuôi file để đoán type nếu mimeType bị null
                const match = /\.(\w+)$/.exec(fileName);
                const type = asset.mimeType || (match ? `image/${match[1]}` : `image/jpeg`);

                const file = {
                    uri: uri,
                    name: fileName,
                    type: type,
                };
                console.log("Ảnh đã chọn:", { uri, file });

                // // Cập nhật state (giữ nguyên logic hiển thị của bạn)
                // setPendingImage({ uri: uri, file });

                // const previewMsg: Message = {
                //     id: generateUniqueId(), // Đảm bảo hàm này đã được import
                //     sender: "user",
                //     text: inputMessage.trim(), // Nếu user chưa nhập gì thì là chuỗi rỗng
                //     image: uri,
                //     isPending: true,
                // };

                // setMessages((prev) => [
                //     ...prev.filter((msg) => !msg.isPending),
                //     previewMsg,
                // ]);
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
                    true && styles.imageButtonActive,
                    true && styles.disabledButton,
                    // hasPendingImage && styles.imageButtonActive,
                    // loading && styles.disabledButton,
                ]}
                onPress={handleImageUpload}
            // disabled={loading}
            >
                <Ionicons
                    name={true ? 'image' : 'image-outline'}
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