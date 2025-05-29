import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import { BlogDetail } from '../types/blog.types';

interface CardDetailBlogProps {
  blog: BlogDetail;
}

const CardDetailBlog: React.FC<CardDetailBlogProps> = ({ blog }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{blog.title}</Text>
      <Text style={styles.date}>Đăng ngày: {formatDate(blog.createdDate)}</Text>
      <Text style={styles.content}>{blog.content}</Text>
      <Text style={styles.email}>Tác giả: {blog.email}</Text>
      {blog.updatedDate && (
        <Text style={styles.date}>
          Cập nhật: {formatDate(blog.updatedDate)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.textWhite,
    borderRadius: 10,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textBlack,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: Colors.textDarkGray,
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: Colors.textBlack,
    marginBottom: 15,
    lineHeight: 24,
  },
  email: {
    fontSize: 14,
    color: Colors.primary,
    fontStyle: 'italic',
  },
});

export default CardDetailBlog;