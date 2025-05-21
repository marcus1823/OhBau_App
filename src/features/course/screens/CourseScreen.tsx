import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import SecondaryHeader from '../../../components/common/Header/SecondaryHeader';
import CourseSection from '../components/CourseSection';

// Dữ liệu mẫu từ API (đã được đồng bộ hóa)
const apiData = {
  status: '200',
  message: 'Get course success',
  data: {
    size: 10,
    page: 1,
    total: 5,
    totalPages: 1,
    items: [
      {
        id: '74e971d9-25d6-4bfe-a7cb-726116f704cb',
        name: 'Tập yoga cho bà bầu',
        rating: 4.8,
        duration: 180,
        price: 1500000,
        category: 'Tập thể dục cho thai nhi',
        active: false,
        lessons: [
          {
            id: 'l1',
            title: 'Khóa học yoga cơ bản',
            chapters: [
              {
                id: 'c1',
                name: 'Chương 1: Khởi động',
                description: 'Hướng dẫn khởi động cơ bản cho bà bầu',
                progress: 0.5,
                lesson: {
                  id: 'ls1',
                  title: 'Bài 1: Khởi động nhẹ nhàng',
                  imageUrl: 'https://example.com/yoga_warmup.jpg',
                  videoUrl: 'https://example.com/yoga_warmup.mp4',
                  content: 'Hướng dẫn các động tác khởi động nhẹ nhàng, giúp cơ thể bà bầu sẵn sàng cho các bài tập yoga. Các bài tập này bao gồm việc giãn cơ cổ, vai, và hông để tăng cường sự linh hoạt và giảm căng thẳng. Hãy thực hiện chậm rãi và đều đặn trong 10-15 phút mỗi ngày để đạt hiệu quả tốt nhất.',
                },
              },
              {
                id: 'c2',
                name: 'Chương 2: Tư thế yoga',
                description: 'Các tư thế yoga an toàn cho bà bầu',
                progress: 0.3,
                lesson: {
                  id: 'ls2',
                  title: 'Bài 1: Tư thế lưng',
                  imageUrl: 'https://example.com/yoga_backpose.jpg',
                  videoUrl: 'https://example.com/yoga_backpose.mp4',
                  content: 'Hướng dẫn tư thế yoga giúp giảm đau lưng trong thai kỳ, bao gồm tư thế mèo/bò và tư thế đứa trẻ. Thực hiện mỗi tư thế trong 5-10 nhịp thở sâu để giảm áp lực lên cột sống và cải thiện tư thế. Kết hợp với hít thở đều để đạt hiệu quả tối ưu.',
                },
              },
            ],
          },
          {
            id: 'l2',
            title: 'Khóa học yoga nâng cao',
            chapters: [
              {
                id: 'c3',
                name: 'Chương 1: Tăng cường sức khỏe',
                description: 'Các bài tập yoga nâng cao để cải thiện sức khỏe tổng thể',
                progress: 0.2,
                lesson: {
                  id: 'ls3',
                  title: 'Bài 1: Tư thế cân bằng',
                  imageUrl: 'https://example.com/yoga_balance.jpg',
                  videoUrl: null,
                  content: 'Hướng dẫn các tư thế cân bằng như cây và chiến binh để cải thiện sự ổn định và sức mạnh cơ bắp. Thực hiện từng tư thế trong 20-30 giây, giữ vững trọng tâm và hít thở đều đặn. Tập luyện này giúp tăng cường sự phối hợp và giảm nguy cơ ngã trong thai kỳ.',
                },
              },
            ],
          },
        ],
        createAt: '2025-05-11T15:08:44.11',
        updateAt: '2025-05-11T15:08:44.11',
        deleteAt: null,
      },
      {
        id: '7a18d783-cfb9-4cfd-b64b-ef0a0bee419f',
        name: 'Thể dục nhịp điệu thai kỳ',
        rating: 4.5,
        duration: 120,
        price: 1000000,
        category: 'Tập thể dục cho thai nhi',
        active: false,
        lessons: [
          {
            id: 'l3',
            title: 'Khóa học nhịp điệu cơ bản',
            chapters: [
              {
                id: 'c4',
                name: 'Chương 1: Nhịp điệu cơ bản',
                description: 'Hướng dẫn các bước nhịp điệu cơ bản cho bà bầu',
                progress: 0.7,
                lesson: {
                  id: 'ls4',
                  title: 'Bài 1: Nhịp điệu nhẹ',
                  imageUrl: 'https://example.com/aerobic_light.jpg',
                  videoUrl: 'https://videos.pexels.com/video-files/2122934/2122934-hd_1920_1080_30fps.mp4',
                  content: 'Hướng dẫn các bước nhịp điệu nhẹ nhàng để tăng cường sức khỏe tim mạch, bao gồm bước đi tại chỗ và vung tay nhẹ. Thực hiện trong 15-20 phút mỗi ngày, kết hợp với nhạc nhẹ nhàng để tạo cảm giác thư giãn. Hãy đảm bảo uống đủ nước trong quá trình tập luyện.',
                },
              },
            ],
          },
        ],
        createAt: '2025-05-11T15:08:44.11',
        updateAt: '2025-05-11T15:08:44.11',
        deleteAt: null,
      },
      {
        id: '296c7604-ef3b-44ff-bc59-db3a616bf14c',
        name: 'Bài tập tăng cường sức khỏe',
        rating: 4.2,
        duration: 90,
        price: 800000,
        category: 'Tập thể dục cho thai nhi',
        active: false,
        lessons: [
          {
            id: 'l4',
            title: 'Khóa học sức khỏe cơ bản',
            chapters: [
              {
                id: 'c5',
                name: 'Chương 1: Bài tập nhẹ nhàng',
                description: 'Các bài tập nhẹ nhàng để tăng cường sức khỏe',
                progress: 0.4,
                lesson: {
                  id: 'ls5',
                  title: 'Bài 1: Đi bộ nhẹ',
                  imageUrl: 'https://example.com/walking_light.jpg',
                  videoUrl: null,
                  content: 'Hướng dẫn đi bộ nhẹ nhàng để cải thiện tuần hoàn, với tốc độ vừa phải trong 20-30 phút mỗi ngày. Chọn địa hình bằng phẳng và mang giày thoải mái. Kết hợp hít thở sâu để tăng cường oxy cho cơ thể và thai nhi.',
                },
              },
            ],
          },
        ],
        createAt: '2025-05-11T15:08:44.11',
        updateAt: '2025-05-11T15:08:44.11',
        deleteAt: null,
      },
      {
        id: 'afd96fb3-6852-489a-a7bf-9453729b0c58',
        name: 'Chăm sóc dinh dưỡng 3 tháng đầu',
        rating: 4.7,
        duration: 30,
        price: 500000,
        category: 'Chăm sóc thai nhi 3 tháng đầu',
        active: true,
        lessons: [
          {
            id: 'l5',
            title: 'Khóa học dinh dưỡng cơ bản',
            chapters: [
              {
                id: 'c6',
                name: 'Chương 1: Dinh dưỡng cần thiết',
                description: 'Hướng dẫn chế độ ăn uống 3 tháng đầu',
                progress: 0,
                lesson: {
                  id: 'ls6',
                  title: 'Thực phẩm nên ăn',
                  imageUrl: 'https://i.pinimg.com/736x/2b/39/40/2b39401a5bd0ba346307bfa2493d2aeb.jpg',
                  videoUrl: 'https://videos.pexels.com/video-files/2122934/2122934-hd_1920_1080_30fps.mp4',
                  content: 'Danh sách thực phẩm nên ăn trong 3 tháng đầu thai kỳ bao gồm các loại rau xanh như cải bó xôi, bông cải xanh,  trái cây giàu vitamin C như cam, kiwi, và các loại đậu để bổ sung protein thực vật. Đồng thời, hãy đảm bảo uống đủ nước và hạn chế đồ chiên xào để bảo vệ sức khỏe mẹ và bé.',
                },
              },
              {
                id: 'c7',
                name: 'Chương 2: Lên thực đơn',
                description: 'Hướng dẫn lập thực đơn phù hợp',
                progress: 0.6,
                lesson: {
                  id: 'ls7',
                  title: 'Bài 1: Thực đơn tuần 1',
                  imageUrl: 'https://i.pinimg.com/736x/2b/39/40/2b39401a5bd0ba346307bfa2493d2aeb.jpg',
                  videoUrl: null,
                  content: 'Gợi ý thực đơn dinh dưỡng cho tuần đầu tiên bao gồm: sáng - sữa chua và trái cây, trưa - cơm gạo lứt với cá hấp và rau luộc, tối - súp rau củ và bánh mì nguyên cám. Hãy điều chỉnh khẩu phần ăn dựa trên nhu cầu cá nhân và tham khảo ý kiến bác sĩ nếu cần.',
                },
              },
            ],
          },
        ],
        createAt: '2025-05-07T19:21:35.66',
        updateAt: null,
        deleteAt: null,
      },
    ],
  },
};

const CourseScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'all' | 'myCourses'>('all');

  const handleOpenNotificationModal = () => {
    console.log('Open notification modal');
  };

  // Nhóm dữ liệu theo category cho tab "Tất cả khóa học" (chỉ lấy active: false)
  const allCourses = apiData.data.items
    .filter((item) => !item.active)
    .reduce((acc, item) => {
      const category = item.category;
      const course = {
        name: item.name,
        rating: item.rating,
        duration: item.duration,
        price: item.price,
        lessons: item.lessons,
        active: item.active, 
      };

      const existingCategory = acc.find((section) => section.title === category);
      if (existingCategory) {
        existingCategory.courses.push(course);
      } else {
        acc.push({ title: category, courses: [course] });
      }
      return acc;
    }, [] as { title: string; courses: { name: string; rating: number; duration: number; price: number; lessons: any[]; active: boolean }[] }[]);

  // Nhóm dữ liệu theo category cho tab "Khóa học của tôi" (chỉ lấy active: true)
  const myCourses = apiData.data.items
    .filter((item) => item.active)
    .reduce((acc, item) => {
      const category = item.category;
      const course = {
        name: item.name,
        rating: item.rating,
        duration: item.duration,
        price: item.price,
        lessons: item.lessons,
        active: item.active, 
      };

      const existingCategory = acc.find((section) => section.title === category);
      if (existingCategory) {
        existingCategory.courses.push(course);
      } else {
        acc.push({ title: category, courses: [course] });
      }
      return acc;
    }, [] as { title: string; courses: { name: string; rating: number; duration: number; price: number; lessons: any[]; active: boolean }[] }[]);

  // Hàm điều hướng khi nhấn vào card
  const handleCardPress = (course: any) => {
    navigation.navigate('CourseDetailScreen', { course });
  };

  return (
    <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
      <SecondaryHeader
        unreadMessages={5}
        unreadNotifications={3}
        onOpenNotificationModal={handleOpenNotificationModal}
      />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'all' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText,
            ]}
          >
            Tất cả khóa học
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'myCourses' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('myCourses')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'myCourses' && styles.activeTabText,
            ]}
          >
            Khóa học của tôi
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'all'
          ? allCourses.map((section, index) => (
              <CourseSection
                key={index}
                title={section.title}
                courses={section.courses}
                showBuyButton={true}
                onCardPress={handleCardPress}
              />
            ))
          : myCourses.map((section, index) => (
              <CourseSection
                key={index}
                title={section.title}
                courses={section.courses}
                showBuyButton={false}
                onCardPress={handleCardPress}
              />
            ))}
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
    paddingTop: 30,
    paddingLeft: 15,
    paddingBottom: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: Colors.primary,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'regular',
    textAlign: 'center',
  },
  activeTabText: {
    color: Colors.textWhite,
    fontWeight: 'bold',
  },
});

export default CourseScreen;