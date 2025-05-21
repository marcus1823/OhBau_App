import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../../assets/styles/colorStyle';
import PrimaryHeader from '../../../components/common/Header/PrimaryHeader';
import ChapterMediaDetailCard from '../components/ChapterMediaDetailCard';
import ChapterContentDetailCard from '../components/ChapterContentDetailCard';

const ChapterDetailScreen = ({ navigation, route }: any) => {
    const { chapter, course } = route.params;
    console.log('Chapter data in ChapterDetailScreen:', chapter); 
    const lesson = chapter.lesson; 

    return (
        <LinearGradient colors={Gradients.backgroundPrimary} style={styles.container}>
            <PrimaryHeader
                title={chapter.name}
                onBackButtonPress={() => navigation.goBack()}
            />

            {/* Nội dung bài học */}
            <ScrollView contentContainerStyle={styles.content}>
                {course.active ? (
                    lesson && Object.keys(lesson).length > 0 ? ( 
                        <View style={styles.lessonContainer}>

                            {/* Card hiển thị media */}
                            <ChapterMediaDetailCard
                                imageUrl={lesson.imageUrl}
                                videoUrl={lesson.videoUrl}
                            />
                            <Text style={styles.lessonTitle}>{lesson.title}</Text>


                            {/* Card hiển thị nội dung */}
                            <ChapterContentDetailCard
                                content={lesson.content}
                            />
                        </View>
                    ) : (
                        <Text style={styles.noLessonsText}>
                            Hiện tại chưa có bài học nào trong chương này.
                        </Text>
                    )
                ) : (
                    <Text style={styles.lockedText}>
                        Vui lòng mua khóa học này để xem nội dung chi tiết.
                    </Text>
                )}
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
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    lessonContainer: {
        marginBottom: 20,
    },
    lessonTitle: {
        fontSize: 18,
        fontWeight: 500,
        color: Colors.textBlack,
        marginBottom: 10,
    },
    noLessonsText: {
        fontSize: 16,
        color: Colors.textBlack,
        textAlign: 'center',
        marginTop: 20,
    },
    lockedText: {
        fontSize: 16,
        color: Colors.textBlack,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ChapterDetailScreen;