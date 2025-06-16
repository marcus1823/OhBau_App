import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Platform, Dimensions } from 'react-native';
import Video from 'react-native-video';
import YoutubePlayer from 'react-native-youtube-iframe'; 
import { Colors } from '../../../assets/styles/colorStyle';

const { width } = Dimensions.get('window');
const isTablet = width > 768;


interface ChapterMediaDetailCardProps {
  imageUrl: string | null;
  videoUrl: string | null;
}

const ChapterMediaDetailCard: React.FC<ChapterMediaDetailCardProps> = ({ imageUrl, videoUrl }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isYouTubeReady, setIsYouTubeReady] = useState(false);

  const isYouTubeUrl = (url: string | null): boolean => {
    if (!url) {return false;}
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) {return null;}
    const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
    return match ? match[1] : null;
  };

  if (videoUrl && isYouTubeUrl(videoUrl)) {
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) {
      return (
        <View style={styles.card}>
          <View style={styles.mediaPlaceholder}>
            <Text style={styles.mediaText}>Liên kết YouTube không hợp lệ</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <YoutubePlayer
          height={isTablet ? 600 : 200}
          videoId={videoId}
          play={false}
          onReady={() => setIsYouTubeReady(true)}
          onError={(e: any) => console.log('YouTube error:', e)}
          onChangeState={(state: any) => console.log('YouTube state:', state)}
          initialPlayerParams={{
            modestbranding: true,
            showClosedCaptions: false,
          }}
        />
        {!isYouTubeReady && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.mediaText}>Đang tải video...</Text>
          </View>
        )}
      </View>
    );
  } else if (videoUrl) {
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
          enterPictureInPictureOnLeave={Platform.OS === 'ios'}
          playInBackground={false}
          onVolumeChange={(event) => {
            console.log('Volume changed:', event);
            setIsMuted(event.volume === 0);
          }}
          onError={(error) => console.log('Video error:', error)}
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
    marginBottom: 30,
    backgroundColor: Colors.textWhite,
  },
  mediaPlaceholder: {
    height: isTablet ? 600 : 200,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
});

export default ChapterMediaDetailCard;