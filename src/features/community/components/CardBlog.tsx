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
  onLikeUpdate?: () => void;
  onCommentUpdate?: () => void; 
}

const CardBlog: React.FC<CardBlogProps> = ({ blog, onPress, navigation, onLikeUpdate, onCommentUpdate }) => {
  const [accountId, setAccountId] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchAccountId = async () => {
      const id = await AsyncStorage.getItem('accountId');
      setAccountId(id);
    };
    fetchAccountId();
  }, []);

  const initialLiked = useMemo(() => {
    if (!accountId || !blog.likeBlogs) { return false; }
    return !!blog.likeBlogs.find((like: LikeBlog) => like.accountId === accountId)?.isLiked;
  }, [accountId, blog.likeBlogs]);

  const handleLike = () => {
    console.log('Like', blog.id);
    if (onLikeUpdate) { onLikeUpdate(); }
  };

  const handleComment = () => {
    console.log('Comment', blog.id);
    navigation.navigate('BlogDetailScreen', { blogId: blog.id });
    if (onCommentUpdate) { onCommentUpdate(); }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  };

  const htmlContent = blog.content || '<p>Không có nội dung</p>';

  const source = {
    html: htmlContent,
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(blog)}
      activeOpacity={0.8}
    >
      <Text style={styles.title}>{blog.title}</Text>
      <View style={styles.infoTopItem}>
          <Text style={styles.authorText}>{blog.authorEmail}</Text>
      <Text style={styles.date}>{formatDate(blog.createdDate)}</Text>
        </View>
      <RenderHTML contentWidth={300} source={source} />
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Icon name="favorite" size={16} color={Colors.textDarkGray} />
          <Text style={styles.infoText}>{blog.totalLike} lượt thích</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="comment" size={16} color={Colors.textDarkGray} />
          <Text style={styles.infoText}>{blog.totalComment} bình luận</Text>
        </View>
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
    padding: 30,
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
  title: {
    fontSize: 18,
    fontFamily: 'LeagueSpartan-SemiBold',
    color: Colors.textBlack,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: Colors.textDarkGray,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  infoTopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
  },
  authorText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'LeagueSpartan-Regular',
    fontStyle: 'italic',
  },
  infoText: {
    fontSize: 14,
    color: Colors.textDarkGray,
    marginLeft: 5,
    fontFamily: 'LeagueSpartan-Regular',
  },
});

export default CardBlog;