import React, { useCallback, useMemo, } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import CardBlog from '../components/CardBlog';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getBlogsApi } from '../api/blogApi';
import { Blog, GetBlogsRequest } from '../types/blog.types';
// import { debounce } from 'lodash';
import SecondaryHeader from '../../../components/common/Header/SecondaryHeader';
import CreatePostInput from '../components/CreatePostInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommunityScreen = ({ navigation }: any) => {
  const [accountId, setAccountId] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const fetchAccountId = async () => {
      const id = await AsyncStorage.getItem('accountId');
      setAccountId(id);
    };
    fetchAccountId();
  }, []);

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['blogs'],
    queryFn: async ({ pageParam = 1 }) => {
      const request: GetBlogsRequest = { pageSize: 10, pageNumber: pageParam };
      const response = await getBlogsApi(request);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      console.log('getNextPageParam:', { page: lastPage.page, totalPages: lastPage.totalPages });
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: true, // Tự động refetch khi màn hình được focus lại
  });

  const blogs = useMemo(() => data?.pages.flatMap((page) => page.items || []) || [], [data]);

  const handleBlogPress = useCallback((blog: Blog) => {
    navigation.navigate('BlogDetailScreen', { blogId: blog.id });
  }, [navigation]);

  const handleCreatePost = useCallback(() => {
    navigation.navigate('CreateBlogScreen');
  }, [navigation]);

  // const debouncedFetchNextPage = useRef(debounce(() => {
  //   if (hasNextPage && !isFetchingNextPage) {fetchNextPage();}
  // }, 300)).current;

  const handleLoadMore = useCallback(() => {
    console.log('onEndReached triggered', { hasNextPage, isFetchingNextPage });
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(({ item }: { item: Blog }) => (
    <CardBlog blog={item} onPress={handleBlogPress} navigation={navigation} onLikeUpdate={() => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', item.id] });
    }} />
  ), [handleBlogPress, navigation, queryClient]);

  const renderHeader = useCallback(() => <CreatePostInput onPress={handleCreatePost} />, [handleCreatePost]);

const renderFooter = useCallback(() => {
    console.log('renderFooter:', { isFetchingNextPage, hasNextPage, blogsLength: blogs.length });
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      );
    }
    if (!hasNextPage && blogs.length > 0) {
      return <Text style={styles.noDataText}>Đã hết bài viết để xem</Text>;
    }
    return null;
  }, [isFetchingNextPage, hasNextPage, blogs.length]);

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <SecondaryHeader
        unreadMessages={0}
        unreadNotifications={10}
        onOpenNotificationModal={() => navigation.navigate('NotificationScreen')}
      />
      <FlatList
        data={blogs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading || isFetching ? <Text style={styles.emptyMessage}>Đang tải...</Text>
          : error instanceof Error ? <Text style={styles.emptyMessage}>Lỗi: {error.message}</Text>
          : <Text style={styles.emptyMessage}>Không có bài viết nào!</Text>
        }
      />
      <LoadingOverlay visible={isLoading || isFetching} fullScreen={false} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, paddingBottom: 100 },
  emptyMessage: { fontSize: 18, color: Colors.textBlack, textAlign: 'center', marginTop: 20 },
  noDataText: { fontSize: 16, color: Colors.textBlack, textAlign: 'center', marginTop: 20 },
  footerLoader: { padding: 20, alignItems: 'center' },
});

export default CommunityScreen;