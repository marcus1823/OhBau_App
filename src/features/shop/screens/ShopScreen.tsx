import { StyleSheet, FlatList } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Gradients } from '../../../assets/styles/colorStyle';
import SecondaryHeader from '../../../components/common/Header/SecondaryHeader';
import { useCategoryQuery } from '../hooks/useCategoryQuery';
import { useProductQuery } from '../hooks/useProductQuery';
import LoadingOverlay from '../../../components/common/Loading/LoadingOverlay';
import CategoryList from '../components/CategoryList';
import ProductList from '../components/ProductList';
import BannerCarousel from '../components/BannerCarousel';
import { useProductByCategoryQuery } from '../hooks/useProductByCategoryQuery';

const ShopScreen = ({ navigation }: any) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { data: categoryData, isLoading: isCategoryLoading } = useCategoryQuery();
  
  const { 
    data: productByCategoryData, 
    isLoading: isProductByCategoryLoading, 
    fetchNextPage: fetchProductByCategoryNextPage, 
    hasNextPage: hasProductByCategoryNextPage, 
    isFetchingNextPage: isProductByCategoryFetchingNextPage
  } = useProductByCategoryQuery({
    id: selectedCategoryId || '',
  });

  const {
    data: productsData,
    isLoading: isProductsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductQuery();

  // Hiển thị loading khi đang tải dữ liệu
  if (isCategoryLoading || (isProductsLoading && !selectedCategoryId) || (isProductByCategoryLoading && selectedCategoryId)) {
    return <LoadingOverlay visible={true} />;
  }

  // Xác định danh sách sản phẩm hiển thị dựa vào selectedCategoryId
  let displayProducts = [];
  let displayFetchNextPage: any = fetchNextPage;
  let displayHasNextPage = hasNextPage;
  let displayIsFetchingNextPage = isFetchingNextPage;

  if (selectedCategoryId) {
    // Nếu có danh mục được chọn, hiển thị sản phẩm theo danh mục
    displayProducts = Array.from(
      new Map(
        (productByCategoryData?.pages.flatMap(page => page.items) || []).map(item => [item.id, item])
      ).values()
    );
    displayFetchNextPage = fetchProductByCategoryNextPage;
    displayHasNextPage = hasProductByCategoryNextPage;
    displayIsFetchingNextPage = isProductByCategoryFetchingNextPage;
  } else {
    // Nếu không có danh mục nào được chọn, hiển thị tất cả sản phẩm
    displayProducts = Array.from(
      new Map(
        (productsData?.pages.flatMap(page => page.items) || []).map(item => [item.id, item])
      ).values()
    );
  }

  const handleCategorySelect = (categoryId: string) => {
    // Nếu người dùng chọn lại danh mục đang được chọn, hủy chọn
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'banner') {
      return <BannerCarousel />;
    }
    if (item.type === 'category') {
      return (
        <CategoryList
          categories={categoryData?.pages?.[0]?.items || []}
          onSelectCategory={handleCategorySelect}
          selectedCategoryId={selectedCategoryId}
        />
      );
    }
    return (
      <ProductList
        navigation={navigation}
        products={displayProducts}
        fetchNextPage={displayFetchNextPage}
        hasNextPage={displayHasNextPage}
        isFetchingNextPage={displayIsFetchingNextPage}
      />
    );
  };

  const data = [
    { id: 'banner-section', type: 'banner' },
    { id: 'category-section', type: 'category' },
    { id: 'products-section', type: 'products' },
  ];

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <SecondaryHeader
        unreadMessages={0}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

export default ShopScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 90,
  },
});