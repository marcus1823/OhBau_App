import React from 'react';
import { Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useCategoryQuery } from '../hooks/useCategoryQuery';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import { Colors } from '../../../assets/styles/colorStyle';

interface CategoryListProps {
  categories: any[];
  onSelectCategory: (categoryId: string) => void;
  selectedCategoryId: string | null;
}

const CategoryList = ({  onSelectCategory, selectedCategoryId }: CategoryListProps) => {
  const { data: categoryData, isLoading } = useCategoryQuery();
  console.log('Category Data:', categoryData);

  if (isLoading) {
    return <LoadingOverlay visible={isLoading} />;
  }

  // Flatten the pages of categories into a single array
  const categoriesData = categoryData?.pages.flatMap(page => page.items) || [];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {categoriesData.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategoryId === category.id ? styles.selectedCategory : null
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text style={styles.categoryText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  categoryButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 6,
  },
  categoryText: {
    fontSize: 16,
    color: Colors.textBlack,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
  },
});