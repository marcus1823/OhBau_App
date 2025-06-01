import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getCommentBlogsApi } from '../api/blogApi';
import { Colors } from '../../../assets/styles/colorStyle';
import CardComment from './CardComment';

interface CommentListProps {
  blogId: string;
}

const CommentList: React.FC<CommentListProps> = ({ blogId }) => {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['comments', blogId],
    queryFn: async ({ pageParam = 1 }) => getCommentBlogsApi({ blogId, pageNumber: pageParam, pageSize: 10 }),
    getNextPageParam: (lastPage) => (lastPage.data.page < lastPage.data.totalPages ? lastPage.data.page + 1 : undefined),
    initialPageParam: 1,
    enabled: !!blogId,
  });

  const comments = React.useMemo(() => data?.pages.flatMap((page) => page.data.items || []) || [], [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {fetchNextPage();}
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(({ item }: { item: any }) => <CardComment comment={item} blogId={blogId} />, [blogId]);

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );}
    return null;
  }, [isFetchingNextPage]);

  if (isLoading) {return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );}
  if (isError) {return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Không thể tải bình luận. Vui lòng thử lại!</Text>
    </View>
  );}

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có bình luận nào</Text>}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 15, marginHorizontal: 15 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorContainer: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 14, color: '#ff4444', textAlign: 'center' },
  footerLoader: { padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 14, color: Colors.textDarkGray, textAlign: 'center', marginVertical: 10 },
});

export default CommentList;