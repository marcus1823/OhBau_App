import React from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import CardDetailBlog from '../components/CardDetailBlog';
import { useQuery } from '@tanstack/react-query';
import { getBlogApi } from '../api/blogApi';

const BlogDetailScreen = ({ route, navigation }: any) => {
  const { blogId } = route.params;

  const {
    data: blogData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => getBlogApi(blogId),
    enabled: !!blogId,
  });
console.log('BlogDetailScreen - blogData:', blogData);

  const renderContent = () => {
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
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Không thể tải bài viết'}
          </Text>
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
    return <CardDetailBlog blog={blogData.data} />;
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Chi tiết bài viết"
        onBackButtonPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
});

export default BlogDetailScreen;