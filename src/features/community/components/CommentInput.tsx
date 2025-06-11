import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateCommentBlog } from '../hooks/useCreateCommentBlog.hook';
import { useReplyCommentBlog } from '../hooks/useReplyCommentBlog.hook';

interface CommentInputProps {
  blogId: string;
  parentCommentId?: string;
  onSubmit?: (comment: any) => void;
  onCommentUpdate?: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ blogId, parentCommentId, onSubmit, onCommentUpdate }) => {
  const [comment, setComment] = useState('');
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const { mutate: createComment, isPending: isCreating } = useCreateCommentBlog();
  const { mutate: replyComment, isPending: isReplying } = useReplyCommentBlog();
  const queryClient = useQueryClient();

  const handleSubmit = () => {
    if (!accessToken) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để bình luận');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('Lỗi', 'Nội dung bình luận không được để trống');
      return;
    }

    const request = { blogId, comment, accessToken };
    const onSuccess = async (data: any) => {
      console.log('Bình luận gửi thành công:', data);
      setComment('');
      if (onSubmit && data.data) { onSubmit(data.data); }

      // Cập nhật lạc quan cho totalComment
      queryClient.setQueryData(['blog', blogId], (oldData: any) => {
        if (!oldData?.data) {return oldData;}
        console.log('Cập nhật lạc quan totalComment:', oldData.data.totalComment);
        return {
          ...oldData,
          data: {
            ...oldData.data,
            totalComment: (oldData.data.totalComment || 0) + 1,
          },
        };
      });
      queryClient.setQueryData(['blogs'], (oldData: any) => {
        if (!oldData?.pages) {return oldData;}
        console.log('Cập nhật lạc quan danh sách blogs:', oldData);
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((item: any) =>
              item.id === blogId ? { ...item, totalComment: (item.totalComment || 0) + 1 } : item
            ),
          })),
        };
      });

      // Làm mới và tải lại dữ liệu
      console.log('Đang làm mới các truy vấn cho blogId:', blogId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['comments', blogId] }),
        queryClient.invalidateQueries({ queryKey: ['blogs'] }),
        queryClient.invalidateQueries({ queryKey: ['blog', blogId] }),
        queryClient.refetchQueries({ queryKey: ['blogs'], type: 'active' }),
        queryClient.refetchQueries({ queryKey: ['blog', blogId], type: 'active' }),
      ]);
      console.log('Các truy vấn đã được làm mới và tải lại');
      if (onCommentUpdate) { onCommentUpdate(); }
      // Alert.alert('Thành công', parentCommentId ? 'Trả lời thành công!' : 'Bình luận thành công!');
    };
    const onError = (error: Error) => {
      console.error('Lỗi khi gửi bình luận:', error);
      Alert.alert('Lỗi', error.message);
    };

    parentCommentId
      ? replyComment({ ...request, parentId: parentCommentId }, { onSuccess, onError })
      : createComment(request, { onSuccess, onError });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={parentCommentId ? "Trả lời bình luận..." : "Viết bình luận..."}
        placeholderTextColor={Colors.textDarkGray}
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleSubmit}
        disabled={isCreating || isReplying || !accessToken}
      >
        <Icon name="send" size={24} color={(isCreating || isReplying ? Colors.textGray : Colors.primary)} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.textWhite,
    borderRadius: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.textLightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: { flex: 1, fontSize: 14, fontFamily: 'LeagueSpartan-Regular', color: Colors.textBlack, padding: 5 },
  sendButton: { padding: 5 },
});

export default CommentInput;