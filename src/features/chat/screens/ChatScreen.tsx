import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sendMessage } from '../../../services/chatService';
import { RouteProp } from '@react-navigation/native';
import { ChatStackParamList } from '../../../types/Navigation/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Message = {
  id: string;
  sender: string;
  message: string;
  time: string;
  isUser: boolean;
};

type ChatScreenProps = {
  route: RouteProp<ChatStackParamList, 'ChatScreen'>;
  navigation: NativeStackNavigationProp<ChatStackParamList>;
};

const ChatScreen: React.FC<ChatScreenProps> = ( { navigation } ) =>
{
  const [ messages, setMessages ] = useState<Message[]>( [
    {
      id: '1',
      sender: 'OhBầu Assistant',
      message: 'Xin chào! Tôi là trợ lý ảo của OhBầu. Tôi có thể giúp gì cho bạn hôm nay?',
      time: new Date().toLocaleTimeString( 'vi-VN', { hour: '2-digit', minute: '2-digit' } ),
      isUser: false,
    }
  ] );
  const [ inputMessage, setInputMessage ] = useState( '' );
  const [ isLoading, setIsLoading ] = useState( false );
  const [ error, setError ] = useState<string | null>( null );

  const flatListRef = useRef<FlatList>( null );

  const scrollToBottom = () =>
  {
    if ( flatListRef.current && messages.length > 0 )
    {
      flatListRef.current.scrollToEnd( { animated: true } );
    }
  };

  useEffect( () =>
  {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ messages ] );

  const handleSendMessage = async () =>
  {
    if ( !inputMessage.trim() ) { return; }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'Tôi',
      message: inputMessage.trim(),
      time: new Date().toLocaleTimeString( 'vi-VN', { hour: '2-digit', minute: '2-digit' } ),
      isUser: true,
    };

    setMessages( prevMessages => [ ...prevMessages, userMessage ] );
    setInputMessage( '' );
    setIsLoading( true );

    try
    {
      const response = await sendMessage( inputMessage );
      const botMessage: Message = {
        id: ( Date.now() + 1 ).toString(),
        sender: 'OhBầu Assistant',
        message: response.message,
        time: new Date().toLocaleTimeString( 'vi-VN', { hour: '2-digit', minute: '2-digit' } ),
        isUser: false,
      };
      setMessages( prevMessages => [ ...prevMessages, botMessage ] );
      setError( null );
    } catch ( err )
    {
      setError( 'Không thể kết nối đến trợ lý. Vui lòng thử lại sau.' );
      console.error( 'Error sending message:', err );
    } finally
    {
      setIsLoading( false );
    }
  };

  const renderFormattedMessage = ( message: string, isUser: boolean ) =>
  {
    const parts = message.split( /(\*\*.*?\*\*)/g );

    return parts.map( ( part, index ) =>
    {
      if ( part.startsWith( '**' ) && part.endsWith( '**' ) )
      {
        const boldText = part.slice( 2, -2 );
        return (
          <Text key={ index } style={ [ styles.messageText, isUser ? styles.userMessageText : styles.botMessageText, styles.boldText ] }>
            { boldText }
          </Text>
        );
      }
      return (
        <Text key={ index } style={ [ styles.messageText, isUser ? styles.userMessageText : styles.botMessageText ] }>
          { part }
        </Text>
      );
    } );
  };

  const renderMessage = ( { item }: { item: Message } ) => (
    <View style={ [ styles.messageContainer, item.isUser ? styles.userMessage : styles.otherMessage ] }>
      { !item.isUser && (
        <Image
          source={ require( '../../../assets/images/skelector/doctorSkelector.jpg' ) }
          style={ styles.avatar }
        />
      ) }
      <View style={ [ styles.messageBubble, item.isUser ? styles.userBubble : styles.otherBubble ] }>
        { !item.isUser && <Text style={ styles.senderName }>{ item.sender }</Text> }
        <Text>
          { renderFormattedMessage( item.message, item.isUser ) }
        </Text>
        <Text style={ styles.messageTime }>{ item.time }</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={ Gradients.backgroundPrimary } style={ styles.container }>
      <PrimaryHeader
        title="Hỏi đáp với OhBầu"
        disableBackButton={ false }
        onBackButtonPress={ () => navigation.goBack() }
      />

      { error && (
        <View style={ styles.errorContainer }>
          <Text style={ styles.errorText }>{ error }</Text>
          <TouchableOpacity onPress={ () => setError( null ) }>
            <Icon name="close" size={ 20 } color={ Colors.textWhite } />
          </TouchableOpacity>
        </View>
      ) }

      <FlatList
        ref={ flatListRef }
        data={ messages }
        renderItem={ renderMessage }
        keyExtractor={ ( item ) => item.id }
        style={ styles.chatList }
        contentContainerStyle={ styles.chatListContent }
        onContentSizeChange={ scrollToBottom }
      />

      { isLoading && (
        <View style={ styles.loadingContainer }>
          <ActivityIndicator size="small" color={ Colors.primary } />
          <Text style={ styles.loadingText }>Đang nhận phản hồi...</Text>
        </View>
      ) }

      <KeyboardAvoidingView
        behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
        keyboardVerticalOffset={ Platform.OS === 'ios' ? 90 : 0 }
      >
        <View style={ styles.inputContainer }>
          <TextInput
            style={ styles.input }
            placeholder="Nhập câu hỏi của bạn..."
            placeholderTextColor={ Colors.textGray }
            multiline
            maxLength={ 500 }
            value={ inputMessage }
            onChangeText={ setInputMessage }
          />
          <TouchableOpacity
            style={ [ styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled ] }
            onPress={ handleSendMessage }
            disabled={ !inputMessage.trim() || isLoading }
          >
            <Icon name="send" size={ 24 } color={ Colors.textWhite } />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ChatScreen;

const styles = StyleSheet.create( {
  container: {
    flex: 1,
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatListContent: {
    paddingTop: 70,
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
    backgroundColor: Colors.textWhite,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: Colors.textWhite,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: Colors.textWhite,
  },
  botMessageText: {
    color: Colors.textBlack,
  },
  boldText: {
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: 12,
    color: Colors.textTimeDay,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
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
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textBlack,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 25,
    padding: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.primary,
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: Colors.textGray,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: Colors.primary,
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#red",
    padding: 12,
    margin: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  errorText: {
    color: Colors.textWhite,
    flex: 1,
  },
} );