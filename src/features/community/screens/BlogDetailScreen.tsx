import React from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import CardDetailBlog from '../components/CardDetailBlog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBlogApi } from '../api/blogApi';
import { useFocusEffect } from '@react-navigation/native'; 

const BlogDetailScreen = ({ route, navigation }: any) => {
  const { blogId } = route.params;
  const queryClient = useQueryClient();

  const { data: blogData, isLoading, error, refetch } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => getBlogApi(blogId),
    enabled: !!blogId,
    refetchOnWindowFocus: true, // Tự động refetch khi màn hình được focus lại
  });

  // Lắng nghe sự kiện focus để refetch dữ liệu
  useFocusEffect(
    React.useCallback(() => {
      refetch(); // Refetch dữ liệu khi màn hình được focus
    }, [refetch])
  );

  const handleLikeUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
    queryClient.invalidateQueries({ queryKey: ['blogs'] }); // Làm mới cả danh sách
  };

  const renderHeader = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error instanceof Error ? error.message : 'Không thể tải bài viết'}</Text>
        </View>
      );
    }
    if (!blogData) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      );
    }
    return <CardDetailBlog blog={blogData.data} onLikeUpdate={handleLikeUpdate} />;
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader title="Chi tiết bài viết" onBackButtonPress={() => navigation.goBack()} />
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 60, paddingBottom: 50 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorContainer: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#ff4444', textAlign: 'center' },
});

export default BlogDetailScreen;