import React, { useCallback, useMemo, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import CardBlog from '../components/CardBlog';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getBlogsApi } from '../api/blogApi';
import { Blog, GetBlogsRequest } from '../types/blog.types';
import { debounce } from 'lodash';
import SecondaryHeader from '../../../components/common/Header/SecondaryHeader';

const CommunityScreen = ({ navigation }: any) => {
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
      const request: GetBlogsRequest = {
        pageSize: 10,
        pageNumber: pageParam,
      };
      try {
        const response = await getBlogsApi(request);
        return response.data;
      } catch (err) {
        throw new Error('Failed to fetch blogs');
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const blogs = useMemo(
    () => data?.pages.flatMap((page) => page.items || []) || [],
    [data]
  );

  const handleBlogPress = useCallback((blog: Blog) => {
    navigation.navigate('BlogDetailScreen', { blogId: blog.id });
  }, [navigation]);

  // Debounce fetchNextPage để tránh gọi API liên tục
  const debouncedFetchNextPage = useRef(
    debounce(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, 300)
  ).current;

  const handleLoadMore = useCallback(() => {
    debouncedFetchNextPage();
  }, [debouncedFetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Blog }) => (
      <CardBlog blog={item} onPress={handleBlogPress} />
    ),
    [handleBlogPress]
  );

  const renderFooter = useCallback(() => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      );
    } else if (!hasNextPage && blogs.length > 0) {
      return <Text style={styles.noDataText}>Đã hết bài viết để xem</Text>;
    }
    return null;
  }, [isFetchingNextPage, hasNextPage, blogs.length]);

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      {/* <PrimaryHeader
        title="Cộng đồng"
        onBackButtonPress={() => navigation.goBack()}
        disableBackButton={false}
      /> */}

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
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading || isFetching ? (
            <Text style={styles.emptyMessage}>Đang tải...</Text>
          ) : error instanceof Error ? (
            <Text style={styles.emptyMessage}>Lỗi: {error.message}</Text>
          ) : (
            <Text style={styles.emptyMessage}>Không có bài viết nào!</Text>
          )
        }
      />
      <LoadingOverlay
        visible={isLoading || isFetching}
        fullScreen={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 50,
  },
  emptyMessage: {
    fontSize: 18,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: 20,
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
  },
});

export default CommunityScreen;