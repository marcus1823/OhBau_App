import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../../assets/styles/colorStyle';
import { Blog } from '../types/blog.types';

interface CardBlogProps {
  blog: Blog;
  onPress: (blog: Blog) => void;
}

const CardBlog: React.FC<CardBlogProps> = ({ blog, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(blog)}>
      <Text style={styles.title}>{blog.title}</Text>
      <Text style={styles.date}>{formatDate(blog.createdDate)}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textBlack,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: Colors.textDarkGray,
  },
});

export default CardBlog;