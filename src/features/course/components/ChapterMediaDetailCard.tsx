import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Video from 'react-native-video'; // Cần cài đặt thư viện này
import { Colors } from '../../../assets/styles/colorStyle';

interface ChapterMediaDetailCardProps {
    imageUrl: string | null;
    videoUrl: string | null; 
}

const ChapterMediaDetailCard: React.FC<ChapterMediaDetailCardProps> = ({ imageUrl, videoUrl }) => {
    // Ưu tiên hiển thị video nếu có, nếu không thì hiển thị ảnh
    const [isMuted, setIsMuted] = useState(false);
    if (videoUrl) {
        return (
            <View style={styles.card}>
                <Video
                    source={{ uri: videoUrl }}
                    style={styles.mediaPlaceholder}
                    controls={true}
                    resizeMode="cover"
                    paused={true}
                    repeat={false}
                    muted={isMuted}
                    volume={isMuted ? 0 : 1}
                    poster={imageUrl || ''}
                    enterPictureInPictureOnLeave={true}
                    playInBackground={true}
                    onVolumeChange={(event) => {
                        console.log('Volume changed:', event);
                        setIsMuted(event.volume === 0);
                    }}
                    onError={(error) => console.error('Video error:', error)}
                    onBuffer={(buffer) => console.log('Buffering:', buffer)}
                    onLoad={(data) => console.log('Video loaded:', data)}
                    onEnd={() => console.log('Video ended')}
                    onReadyForDisplay={() => console.log('Video ready for display')}
                />
            </View>
        );
    } else if (imageUrl) {
        return (
            <View style={styles.card}>
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.mediaPlaceholder}
                    resizeMode="cover"
                />
            </View>
        );
    } else {
        return (
            <View style={styles.card}>
                <View style={styles.mediaPlaceholder}>
                    <Text style={styles.mediaText}>Không có media</Text>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 30,
        // padding: 10,
        marginBottom: 30,
        backgroundColor: Colors.textWhite,
    },
    mediaPlaceholder: {
        height: 200,
        borderRadius: 30,
        backgroundColor: Colors.textWhite,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaText: {
        fontSize: 14,
        color: Colors.textBlack,
        textAlign: 'center',
    },
});

export default ChapterMediaDetailCard;