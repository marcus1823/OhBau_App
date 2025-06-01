import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import { Blog, LikeBlog } from '../types/blog.types';
import RenderHTML from 'react-native-render-html';
import ActionBlogs from './ActionBlogs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CardBlogProps {
  blog: Blog;
  onPress: (blog: Blog) => void;
  navigation: any;
  onLikeUpdate?: () => void; // Thêm prop để nhận callback
}

const CardBlog: React.FC<CardBlogProps> = ({ blog, onPress, navigation, onLikeUpdate }) => {
  const [accountId, setAccountId] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchAccountId = async () => {
      const id = await AsyncStorage.getItem('accountId');
      setAccountId(id);
    };
    fetchAccountId();
  }, []);

  const initialLiked = useMemo(() => {
    if (!accountId || !blog.likeBlogs) {return false;}
    return !!blog.likeBlogs.find((like: LikeBlog) => like.accountId === accountId)?.isLiked;
  }, [accountId, blog.likeBlogs]);

  const handleLike = () => {
    console.log('Like', blog.id);
    if (onLikeUpdate) {onLikeUpdate();} // Gọi callback khi like
  };
  const handleComment = () => {
    console.log('Comment', blog.id);
    navigation.navigate('BlogDetailScreen', { blogId: blog.id });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(blog)}
      activeOpacity={0.8}
    >
      <Text style={styles.title}>{blog.title}</Text>
      <Text style={styles.date}>{formatDate(blog.createdDate)}</Text>
      <RenderHTML contentWidth={300} source={{ html: blog.content || '<p>Không có nội dung</p>' }} />
      <View style={styles.likeInfo}>
        <Icon name="favorite" size={16} color={Colors.textDarkGray} />
        <Text style={styles.totalLikeText}>{blog.totalLike} lượt thích</Text>
      </View>
      <ActionBlogs
        blogId={blog.id}
        onLikePress={handleLike}
        onCommentPress={handleComment}
        initialLiked={initialLiked}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.textWhite,
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: Colors.textLightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  title: { fontSize: 18, fontFamily: 'LeagueSpartan-SemiBold', color: Colors.textBlack, marginBottom: 5 },
  date: { fontSize: 12, color: Colors.textDarkGray, marginBottom: 10 },
  likeInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 5 },
  totalLikeText: { fontSize: 14, color: Colors.textDarkGray, marginLeft: 5, fontFamily: 'LeagueSpartan-Regular' },
});

export default CardBlog;