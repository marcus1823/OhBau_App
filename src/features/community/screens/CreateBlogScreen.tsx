import React, { useRef, useState } from 'react';
import { StyleSheet, View, TextInput, Alert, TouchableOpacity, Text, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import { RootState } from '../../../stores/store';
import { useUploadImage } from '../hooks/useUploadImage.hook';
import { useCreateBlog } from '../hooks/useCreateBlog.hook';
import { useSelector } from 'react-redux';

// Định nghĩa iconMap tĩnh bên ngoài component
const iconMap = {
  [actions.setBold]: ({ tintColor }: { tintColor: string }) => (
    <Icon name="format-bold" size={20} color={tintColor} />
  ),
  [actions.setItalic]: ({ tintColor }: { tintColor: string }) => (
    <Icon name="format-italic" size={20} color={tintColor} />
  ),
  [actions.setUnderline]: ({ tintColor }: { tintColor: string }) => (
    <Icon name="format-underlined" size={20} color={tintColor} />
  ),
  [actions.insertBulletsList]: ({ tintColor }: { tintColor: string }) => (
    <Icon name="format-list-bulleted" size={20} color={tintColor} />
  ),
  [actions.insertOrderedList]: ({ tintColor }: { tintColor: string }) => (
    <Icon name="format-list-numbered" size={20} color={tintColor} />
  ),
  [actions.insertLink]: ({ tintColor }: { tintColor: string }) => (
    <Icon name="link" size={20} color={tintColor} />
  ),
  [actions.insertImage]: ({ tintColor }: { tintColor: string }) => (
    <Icon name="image" size={20} color={tintColor} />
  ),
};

const CreateBlogScreen = ({ navigation }: any) => {
  const richText = useRef<RichEditor>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  // Gọi hook ngay tại đầu component, không điều kiện
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
  const { mutate: createBlog, isPending: isCreating } = useCreateBlog();

  // Kiểm tra accessToken và điều hướng nếu không hợp lệ
  // if (!accessToken) {
  //   return (
  //     <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
  //       <PrimaryHeader title="Tạo bài viết" onBackButtonPress={() => navigation.goBack()} />
  //       <View style={styles.content}>
  //         <Text style={styles.errorText}>Lỗi: Không có token xác thực. Vui lòng đăng nhập lại.</Text>
  //       </View>
  //     </LinearGradient>
  //   );
  // }
  if (!accessToken) {
    return null; // Trả về null nếu không có accessToken
  }

  // Xử lý chọn và upload ảnh
  const handleImageUpload = async () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Lỗi', 'Không thể chọn ảnh: ' + response.errorMessage);
      } else if (response.assets && response.assets[0].uri) {
        const formData = new FormData();
        formData.append('file', {
          uri: response.assets[0].uri,
          type: response.assets[0].type || 'image/jpeg',
          name: response.assets[0].fileName || 'image.jpg',
        });

        uploadImage(
          { image: formData, accessToken },
          {
            onSuccess: (imageUrl) => {
              if (richText.current) {
                if (imageUrl) {
                  richText.current.insertImage(imageUrl);
                  console.log('Image inserted:', imageUrl);
                } else {
                  console.log('Image URL is undefined, cannot insert');
                }
              } else {
                console.log('RichEditor ref is null');
              }
            },
            onError: (error) => Alert.alert('Lỗi', error.message),
          }
        );
      }
    });
  };

  const handleCreateBlog = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Lỗi', 'Tiêu đề và nội dung không được để trống!');
      return;
    }
    console.log('Nội dung trước khi gửi:', content);
    createBlog(
      { title, content, accessToken },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Tạo bài viết thành công!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (error) => Alert.alert('Lỗi', error.message),
      }
    );
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader title="Tạo bài viết" onBackButtonPress={() => navigation.goBack()} />
      <View style={styles.toolbarContainer}>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.insertImage,
          ]}
          iconMap={iconMap}
          onPressAddImage={handleImageUpload}
          style={styles.toolbar}
          disabled={isUploading}
        />
        <TouchableOpacity
          style={[styles.submitButton, (isUploading || isCreating) && styles.disabledButton]}
          onPress={handleCreateBlog}
          disabled={isUploading || isCreating}
          activeOpacity={0.7}
        >
          <Text style={styles.submitButtonText}>
            {isCreating ? 'Đang tạo...' : 'Đăng bài viết'}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={styles.titleInput}
          placeholder="Nhập tiêu đề..."
          value={title}
          onChangeText={setTitle}
        />
        <RichEditor
          ref={richText}
          style={styles.editor}
          placeholder="Nhập nội dung..."
          onChange={(html) => setContent(html)}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  content: { // Added content style
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: Colors.textWhite,
    fontSize: 16,
  },
  editor: {
    minHeight: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  toolbarContainer: {
    paddingTop: 60,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  toolbar: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: Colors.textWhite,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    padding: 20,
  },
});

export default CreateBlogScreen;