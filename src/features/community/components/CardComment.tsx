import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../../assets/styles/colorStyle';
import { Comment } from '../types/blog.types';
import CommentInput from './CommentInput';

interface CardCommentProps {
  comment: Comment;
  blogId: string;
  isReply?: boolean;
}

const CardComment: React.FC<CardCommentProps> = ({ comment, blogId, isReply = false }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <View style={[styles.card, isReply && styles.replyCard]}>
      <View style={styles.header}>
        <Text style={styles.email}>{comment.email}</Text>
        <Text style={styles.date}>{formatDate(comment.createdDate)}</Text>
      </View>
      <Text style={styles.commentText}>{comment.comment}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowReplyInput(!showReplyInput)}
          activeOpacity={0.7}
        >
          <Icon name="reply" size={16} color="#808080" />
          <Text style={styles.actionText}>Trả lời</Text>
        </TouchableOpacity>
      </View>
      {showReplyInput && (
        <CommentInput blogId={blogId} parentCommentId={comment.id} onSubmit={() => setShowReplyInput(false)} />
      )}
      {comment.replies?.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CardComment key={reply.id} comment={reply} blogId={blogId} isReply={true} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.textWhite,
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: Colors.textLightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  replyCard: { marginLeft: 20, borderLeftWidth: 2, borderLeftColor: Colors.textLightGray },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  email: { fontSize: 14, fontFamily: 'LeagueSpartan-SemiBold', color: Colors.primary },
  date: { fontSize: 12, fontFamily: 'LeagueSpartan-Regular', color: Colors.textDarkGray },
  commentText: { fontSize: 14, fontFamily: 'LeagueSpartan-Regular', color: Colors.textBlack, marginBottom: 5 },
  actions: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: 5 },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: 4 },
  actionText: { fontSize: 12, color: '#808080', marginLeft: 3, fontFamily: 'LeagueSpartan-Regular' },
  repliesContainer: { marginTop: 10 },
});

export default CardComment;