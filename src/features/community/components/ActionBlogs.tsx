import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';
import { useLikeAndDislikeBlog } from '../hooks/useLikeAndDislikeBlog.hook';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { useQueryClient } from '@tanstack/react-query';

interface ActionBlogsProps {
  blogId: string;
  onLikePress: (blogId: string) => void;
  onCommentPress: (blogId: string) => void;
  initialLiked?: boolean;
}

const ActionBlogs: React.FC<ActionBlogsProps> = ({
  blogId,
  onLikePress,
  onCommentPress,
  initialLiked = false,
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const { mutate: likeOrDislike, isPending } = useLikeAndDislikeBlog();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const queryClient = useQueryClient();

  useEffect(() => setIsLiked(initialLiked), [initialLiked]);

  const handleLike = () => {
    if (!accessToken) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để thích bài viết');
      return;
    }

    likeOrDislike(
      { blogId, accessToken },
      {
        onSuccess: (data) => {
          const newIsLiked = data.message === 'Like blog success';
          setIsLiked(newIsLiked);
          onLikePress(blogId); // Gọi callback để làm mới dữ liệu
          // Invalidate cả danh sách và chi tiết blog
          queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
          queryClient.invalidateQueries({ queryKey: ['blogs'] });
          // Alert.alert('Thành công', data.message); nào cần hiển thị thông báo thì bật =))
        },
        onError: (error) => Alert.alert('Lỗi', error.message),
      }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLike}
        disabled={isPending || !accessToken}
      >
        <Icon name={isLiked ? 'favorite' : 'favorite-border'} size={20} color={isLiked ? '#FF0000' : '#808080'} />
        <Text style={[styles.text, isLiked && styles.likedText]}>Thích</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => onCommentPress(blogId)}>
        <Icon name="comment" size={20} color="#808080" />
        <Text style={styles.text}>Bình luận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.textGray,
    paddingTop: 10,
    marginTop: 10,
  },
  button: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  text: { fontSize: 14, color: '#808080', marginLeft: 5, fontFamily: 'LeagueSpartan-Regular' },
  likedText: { color: '#FF0000', fontFamily: 'LeagueSpartan-Medium' },
});

export default ActionBlogs;