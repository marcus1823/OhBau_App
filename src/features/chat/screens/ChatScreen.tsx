import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Dữ liệu mẫu
const mockMessages = [
  {
    id: '1',
    sender: 'Bác sĩ Minh',
    message: 'Chào chị, tuần này em bé phát triển tốt chứ? Có cần tư vấn gì thêm không?',
    time: '10:30',
    isUser: false,
  },
  {
    id: '2',
    sender: 'Tôi',
    message: 'Dạ bác sĩ, em bé ổn, nhưng em hay bị chuột rút, có cách nào cải thiện không ạ?',
    time: '10:32',
    isUser: true,
  },
  {
    id: '3',
    sender: 'Bác sĩ Minh',
    message: 'Chuột rút là bình thường, chị thử bổ sung thực phẩm giàu kali như chuối, cam nhé. Nếu vẫn khó chịu, báo lại cho tôi.',
    time: '10:35',
    isUser: false,
  },
];

const ChatScreen = ({navigation}: any) => {
  const renderMessage = ({ item }:any) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.otherMessage]}>
      {!item.isUser && (
        <Image
          source={{ uri: 'https://i.pinimg.com/736x/6c/59/95/6c599523460f54ddeba81f3cd689ae04.jpg' }}
          style={styles.avatar}
        />
      )}
      <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.otherBubble]}>
        {!item.isUser && <Text style={styles.senderName}>{item.sender}</Text>}
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Chat với bác sĩ"
        disableBackButton={false}
        onBackButtonPress={() => navigation.goBack()}
        moreButton={true}
        modalTitle="Tùy chọn"
        modalButtons={[
          { text: 'Xem hồ sơ bác sĩ', onPress: () => console.log('Xem hồ sơ') },
          { text: 'Xóa cuộc trò chuyện', onPress: () => console.log('Xóa chat') },
        ]}
        onModalClose={() => console.log('Modal closed')}
      />
      <FlatList
        data={mockMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        contentContainerStyle={styles.chatListContent}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={Colors.primary}
          multiline
        />
        <TouchableOpacity style={styles.sendButton}>
          <Icon name="send" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatListContent: {
    paddingTop: 60,
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 12,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: Colors.textWhite,
    borderBottomLeftRadius: 0,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: Colors.textBlack,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.textTimeDay,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    marginBottom: 70,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.textWhite,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.textGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: Colors.textBlack,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});