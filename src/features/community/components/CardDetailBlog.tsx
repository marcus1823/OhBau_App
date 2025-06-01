import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import { BlogDetail, LikeBlog } from '../types/blog.types';
import RenderHTML from 'react-native-render-html';
import ActionBlogs from './ActionBlogs';
import CommentList from './CommentList';
import CommentInput from './CommentInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface CardDetailBlogProps {
  blog: BlogDetail;
  onLikeUpdate?: () => void;
}

const CardDetailBlog: React.FC<CardDetailBlogProps> = ({ blog, onLikeUpdate }) => {
  const [accountId, setAccountId] = React.useState<string | null>(null);
  console.log('blog in CardDetailBlog:', blog);
  console.log('accountId in CardDetailBlog:', accountId);
  console.log('totalLike in CardDetailBlog:', blog.totalLike);
  
  
  
  useEffect(() => {
    const fetchAccountId = async () => {
      const id = await AsyncStorage.getItem('accountId');
      setAccountId(id);
    };
    fetchAccountId();
  }, []);

  const initialLiked = useMemo(() => {
    if (!accountId || !blog.likeBlogs) {return false;}
    const liked = !!blog.likeBlogs.find((like: LikeBlog) => like.accountId === accountId)?.isLiked;
    console.log('initialLiked in CardDetailBlog:', liked, 'accountId:', accountId, 'likeBlogs:', blog.likeBlogs);
    return liked;
  }, [accountId, blog.likeBlogs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  };

  const handleLikePress = () => {
    if (onLikeUpdate) {onLikeUpdate();}
  };

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.date}>{formatDate(blog.createdDate)}</Text>
        <RenderHTML contentWidth={300} source={{ html: blog.content || '<p>Không có nội dung</p>' }} />
        <View style={styles.authorInfoContainer}>
          {blog.updatedDate && <Text style={styles.updatedDate}>Cập nhật: {formatDate(blog.updatedDate)}</Text>}
          <Text style={styles.email}>Tác giả: {blog.email}</Text>
        </View>
        <View style={styles.likeInfo}>
          <Icon name="favorite" size={16} color={Colors.textDarkGray} />
          <Text style={styles.totalLikeText}>{blog.totalLike} lượt thích</Text>
        </View>
        <ActionBlogs
          blogId={blog.id}
          onLikePress={handleLikePress}
          onCommentPress={() => console.log('Bình luận bài viết', blog.id)}
          initialLiked={initialLiked}
        />
      </View>
      <CommentList blogId={blog.id} />
      <CommentInput blogId={blog.id} />
    </View>
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
  title: { fontSize: 20, fontFamily: 'LeagueSpartan-SemiBold', color: Colors.textBlack, marginBottom: 5 },
  date: { fontSize: 12, fontFamily: 'LeagueSpartan-Regular', color: Colors.textDarkGray, marginBottom: 10 },
  authorInfoContainer: { flexDirection: 'column', justifyContent: 'space-between', marginTop: 15 },
  updatedDate: { fontSize: 12, fontFamily: 'LeagueSpartan-Regular', color: Colors.textDarkGray, fontStyle: 'italic', alignSelf: 'flex-end' },
  email: { fontSize: 14, fontFamily: 'LeagueSpartan-Regular', color: Colors.primary, fontStyle: 'italic', alignSelf: 'flex-end' },
  likeInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 5 },
  totalLikeText: { fontSize: 14, color: Colors.textDarkGray, marginLeft: 5, fontFamily: 'LeagueSpartan-Regular' },
});

export default CardDetailBlog;