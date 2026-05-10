// app/onboarding.tsx
import { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  ListRenderItemInfo,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Data ─────────────────────────────────────────────────────────────────────

interface OnboardingSlide {
  id: string;
  image: any; // require('../assets/images/onboarding-x.png')
  title: string;
  description: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    image: require('@/assets/images/onboarding-1.png'),
    title: 'Thưởng thức tại gia',
    description:
      'Hệ thống OHIO kết nối bạn với hàng ngàn quán ăn ngon nhất khu vực. Dễ dàng, tiện lợi và không cần phải nấu nướng',
  },
  {
    id: '2',
    image: require('@/assets/images/onboarding-2.png'),
    title: 'Công nghệ giao hàng thông minh',
    description:
      'Nhận đơn hàng trong vòng 30 phút, theo dõi trực tuyến mọi lúc mọi nơi. Nhận điểm thưởng OHIO cho mỗi đơn hàng',
  },
  {
    id: '3',
    image: require('@/assets/images/onboarding-3.png'),
    title: 'Hàng ngàn món ngon',
    description:
      'Hệ thống OHIO kết nối bạn với hàng ngàn quán ăn ngon nhất khu vực. Dễ dàng, tiện lợi và không cần phải nấu nướng',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function OhioLogo() {
  return (
    <View style={styles.logoRow}>
      <View style={styles.logoIcon}>
        <Text style={styles.logoIconText}>🕐</Text>
      </View>
      <View>
        <Text style={styles.logoName}>OHIO</Text>
        <Text style={styles.logoSub}>FOOD DELIVERY</Text>
      </View>
    </View>
  );
}

function PaginationDots({ currentIndex }: { currentIndex: number }) {
  return (
    <View style={styles.dotsRow}>
      {SLIDES.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === currentIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
}

function SlideItem({ item }: { item: OnboardingSlide }) {
  return (
    <View style={styles.slide}>
      <OhioLogo />
      <Image source={item.image} style={styles.illustration} resizeMode="contain" />
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const isLast = currentIndex === SLIDES.length - 1;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  function handlePressNext() {
    if (isLast) {
      router.replace('/(auth)/login');
      return;
    }
    flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
  }

  function handlePressSkip() {
    router.replace('/(auth)/login');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: ListRenderItemInfo<OnboardingSlide>) => (
          <SlideItem item={item} />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEventThrottle={16}
        style={styles.flatList}
      />

      {/* Bottom card */}
      <View style={styles.bottomCard}>
        <Text style={styles.slideTitle}>{SLIDES[currentIndex].title}</Text>
        <Text style={styles.slideDescription}>{SLIDES[currentIndex].description}</Text>

        <PaginationDots currentIndex={currentIndex} />

        <View style={styles.buttonRow}>
          {!isLast && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handlePressSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, isLast && styles.nextButtonFull]}
            onPress={handlePressNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>
              {isLast ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ORANGE = '#E8441A';
const CREAM = '#FEF3E8';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  flatList: {
    flex: 1,
  },

  // Slide
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 24,
    backgroundColor: CREAM,
  },

  // Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    fontSize: 20,
  },
  logoName: {
    fontSize: 26,
    fontWeight: '900',
    color: ORANGE,
    letterSpacing: 2,
    lineHeight: 28,
  },
  logoSub: {
    fontSize: 10,
    fontWeight: '600',
    color: ORANGE,
    letterSpacing: 3,
  },

  // Illustration
  illustration: {
    width: SCREEN_WIDTH * 0.82,
    height: SCREEN_WIDTH * 0.82,
  },

  // Bottom card
  bottomCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 10,
  },
  slideDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  dotActive: {
    width: 24,
    backgroundColor: ORANGE,
  },

  // Buttons
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: ORANGE,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: ORANGE,
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: ORANGE,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});