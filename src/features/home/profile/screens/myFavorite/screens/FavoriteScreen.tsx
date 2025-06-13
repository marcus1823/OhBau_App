import { useQueryClient } from "@tanstack/react-query";
import { useFetchFavoriteCourses } from "../../../../../course/hooks/useCourse.hook";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CourseCard from "../../../../../course/components/CourseCard";
import LinearGradient from "react-native-linear-gradient";
import PrimaryHeader from "../../../../../../components/common/Header/PrimaryHeader";
import LoadingOverlay from "../../../../../../components/common/Loading/LoadingOverlay";
import { Colors, Gradients } from "../../../../../../assets/styles/colorStyle";

const FavoriteScreen = ({ navigation }: any) => {
  const queryClient = useQueryClient();
  const { data: favoriteCourses, isLoading, isError, error } = useFetchFavoriteCourses();

  // Refresh favorite courses data when screen is focused
  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['favoriteCourses'] });
    }, [queryClient])
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.cardContainer}>
      <CourseCard
        courseId={item.courseId}
        name={item.name}
        rating={4.5} // Default rating as it might not be in the API response
        duration={item.duration}
        index={index}
        navigation={navigation}
        showBuyButton={true}
      />
    </View>
  );

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <PrimaryHeader
        title="Khóa học yêu thích"
        onBackButtonPress={() => navigation.goBack()}
      />
      
      {isLoading ? (
        <LoadingOverlay visible={true} fullScreen={false} />
      ) : isError ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải khóa học yêu thích'}
          </Text>
        </View>
      ) : favoriteCourses && favoriteCourses.length > 0 ? (
        <FlatList
          data={favoriteCourses}
          renderItem={renderItem}
          keyExtractor={(item) => item.courseId}
          contentContainerStyle={styles.content}
          numColumns={1}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Bạn chưa có khóa học yêu thích nào</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 70,
    paddingHorizontal: 15,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  cardContainer: {
    width: '100%',
    marginBottom: 15,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textBlack,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default FavoriteScreen;