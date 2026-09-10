import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { apiRequest, API_BASE_URL } from '@/services/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

type GalleryItem = {
  id: number;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  is_active: boolean;
};

const getImageUrl = (imageUrl: string) => {
  if (!imageUrl) {
    return '';
  }

  // Already a complete URL
  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://')
  ) {
    return imageUrl;
  }

  // API_BASE_URL is:
  // https://templeapp-s96e.onrender.com/api
  // We need:
  // https://templeapp-s96e.onrender.com/uploads/...
  const serverUrl = API_BASE_URL.replace(/\/api\/?$/, '');

  return `${serverUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

export default function GalleryScreen() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [showAllPhotos, setShowAllPhotos] =
    useState(false);

  const [selectedImageIndex, setSelectedImageIndex] =
    useState<number | null>(null);

  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRequest<{
        success: boolean;
        data: GalleryItem[];
      }>('/gallery');

      if (response.success) {
        setGalleryItems(response.data || []);
      } else {
        setGalleryItems([]);
      }
    } catch (err) {
      console.error('Gallery loading error:', err);

      setError('Unable to load gallery');

      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  /*
   * Reload gallery whenever this screen becomes visible again.
   *
   * This is useful when Admin changes gallery content
   * and the user comes back to this screen.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      loadGallery();
    }, 60000);

    return () => clearInterval(interval);
  }, [loadGallery]);

  const openImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (
      selectedImageIndex === null ||
      galleryItems.length === 0
    ) {
      return;
    }

    setSelectedImageIndex(
      (selectedImageIndex + 1) % galleryItems.length,
    );
  };

  const previousImage = () => {
    if (
      selectedImageIndex === null ||
      galleryItems.length === 0
    ) {
      return;
    }

    setSelectedImageIndex(
      selectedImageIndex === 0
        ? galleryItems.length - 1
        : selectedImageIndex - 1,
    );
  };

  const selectedImage =
    selectedImageIndex !== null
      ? galleryItems[selectedImageIndex]
      : null;

  /*
   * First 5 images are used on the main Gallery page.
   */
  const previewImages = galleryItems.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF9F0"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#A85D25"
            />

            <Text style={styles.loadingText}>
              Loading gallery...
            </Text>
          </View>
        ) : error ? (
          /* ================================================= */
          /* ERROR */
          /* ================================================= */

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Unable to load gallery
            </Text>

            <Text style={styles.emptyText}>
              Please check your internet connection and try
              again.
            </Text>

            <Pressable
              onPress={loadGallery}
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.retryText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : showAllPhotos ? (
          <>
            {/* ================================================= */}
            {/* VIEW ALL PHOTO GALLERY */}
            {/* ================================================= */}

            <View style={styles.galleryHeader}>
              <Pressable
                onPress={() => setShowAllPhotos(false)}
                style={({ pressed }) => [
                  styles.backButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.backArrow}>‹</Text>
              </Pressable>

              <View style={styles.galleryHeaderText}>
                <Text style={styles.galleryEyebrow}>
                  TEMPLE MEDIA
                </Text>

                <Text style={styles.galleryPageTitle}>
                  Temple Gallery
                </Text>

                <Text style={styles.galleryPageSubtitle}>
                  Explore sacred moments from Hariharapura
                </Text>
              </View>

              <View style={styles.photoCount}>
                <Text style={styles.photoCountNumber}>
                  {galleryItems.length}
                </Text>

                <Text style={styles.photoCountLabel}>
                  PHOTOS
                </Text>
              </View>
            </View>

            {/* ================================================= */}
            {/* FULL GALLERY */}
            {/* ================================================= */}

            <View style={styles.fullGalleryGrid}>
              {galleryItems.map((item, index) => (
                <View
                  key={item.id}
                  style={styles.fullGalleryWrapper}
                >
                  <Pressable
                    onPress={() => openImage(index)}
                    style={({ pressed }) => [
                      styles.fullGalleryItem,
                      pressed &&
                        styles.galleryItemPressed,
                    ]}
                  >
                    <Image
                      source={{
                        uri: getImageUrl(item.image_url),
                      }}
                      style={styles.fullGalleryImage}
                      resizeMode="cover"
                    />
                  </Pressable>

                  {/* ================================================= */}
                  {/* SHOW TITLE / DESCRIPTION ONLY IF AVAILABLE */}
                  {/* ================================================= */}

                  {(item.title?.trim() ||
                    item.description?.trim()) && (
                    <View style={styles.galleryTextContainer}>
                      {item.title?.trim() ? (
                        <Text
                          style={styles.fullGalleryTitle}
                        >
                          {item.title}
                        </Text>
                      ) : null}

                      {item.description?.trim() ? (
                        <Text
                          style={
                            styles.fullGalleryDescription
                          }
                        >
                          {item.description}
                        </Text>
                      ) : null}
                    </View>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.galleryBottomSpace} />
          </>
        ) : (
          <>
            {/* ================================================= */}
            {/* MAIN GALLERY PAGE */}
            {/* ================================================= */}

            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.eyebrow}>
                  TEMPLE MEDIA
                </Text>

                <Text style={styles.title}>
                  Gallery
                </Text>

                <Text style={styles.subtitle}>
                  Explore temple photos, videos and devotional
                  stotras
                </Text>
              </View>
            </View>

            {/* ================================================= */}
            {/* PHOTOS SECTION */}
            {/* ================================================= */}

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Photos
                </Text>

                <Text style={styles.sectionCaption}>
                  Moments from the temple
                </Text>
              </View>

              {galleryItems.length > 0 && (
                <Pressable
                  onPress={() => setShowAllPhotos(true)}
                  style={({ pressed }) => [
                    styles.viewAllButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.viewAllText}>
                    View All
                  </Text>

                  <Text style={styles.viewAllArrow}>
                    ›
                  </Text>
                </Pressable>
              )}
            </View>

            {/* ================================================= */}
            {/* NO PHOTOS */}
            {/* ================================================= */}

            {galleryItems.length === 0 ? (
              <View style={styles.noPhotosCard}>
                <Text style={styles.noPhotosTitle}>
                  No photos available
                </Text>

                <Text style={styles.noPhotosText}>
                  Temple gallery photos will appear here when
                  they are added by the administrator.
                </Text>
              </View>
            ) : (
              <>
                {/* ================================================= */}
                {/* FEATURED PHOTO */}
                {/* ================================================= */}

                <Pressable
                  onPress={() => {
                    setShowAllPhotos(true);
                  }}
                  style={({ pressed }) => [
                    styles.previewHero,
                    pressed &&
                      styles.galleryItemPressed,
                  ]}
                >
                  <Image
                    source={{
                      uri: getImageUrl(
                        previewImages[0].image_url,
                      ),
                    }}
                    style={styles.previewHeroImage}
                    resizeMode="cover"
                  />

                  <View style={styles.previewOverlay} />

                  <View style={styles.previewContent}>
                    <View style={styles.previewBadge}>
                      <Text
                        style={styles.previewBadgeText}
                      >
                        TEMPLE GALLERY
                      </Text>
                    </View>

                    <Text style={styles.previewTitle}>
                      {previewImages[0].title ||
                        'Temple Gallery'}
                    </Text>

                    <Text style={styles.previewSubtitle}>
                      Tap to explore all{' '}
                      {galleryItems.length} photographs
                    </Text>
                  </View>

                  <View style={styles.previewCount}>
                    <Text
                      style={styles.previewCountNumber}
                    >
                      {galleryItems.length}
                    </Text>

                    <Text
                      style={styles.previewCountLabel}
                    >
                      PHOTOS
                    </Text>
                  </View>
                </Pressable>

                {/* ================================================= */}
                {/* SMALL PHOTO PREVIEW GRID */}
                {/* ================================================= */}

                {previewImages.length > 1 && (
                  <View style={styles.smallGrid}>
                    {previewImages
                      .slice(1, 5)
                      .map((item, index) => (
                        <Pressable
                          key={item.id}
                          onPress={() => {
                            setShowAllPhotos(true);

                            setTimeout(() => {
                              setSelectedImageIndex(
                                index + 1,
                              );
                            }, 100);
                          }}
                          style={({ pressed }) => [
                            styles.smallPhotoCard,
                            pressed &&
                              styles.galleryItemPressed,
                          ]}
                        >
                          <Image
                            source={{
                              uri: getImageUrl(
                                item.image_url,
                              ),
                            }}
                            style={styles.smallPhoto}
                            resizeMode="cover"
                          />

                          <View
                            style={
                              styles.smallPhotoOverlay
                            }
                          />

                          <Text
                            style={styles.smallPhotoTitle}
                            numberOfLines={2}
                          >
                            {item.title ||
                              'Temple Photo'}
                          </Text>
                        </Pressable>
                      ))}
                  </View>
                )}
              </>
            )}

            {/* ================================================= */}
            {/* VIDEOS */}
            {/* ================================================= */}

            <View style={styles.sectionHeaderStandalone}>
              <View>
                <Text style={styles.sectionTitle}>
                  Videos
                </Text>

                <Text style={styles.sectionCaption}>
                  Watch temple moments
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.videoCard,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.videoThumbnail}>
                <View style={styles.playButton}>
                  <Text style={styles.playIcon}>
                    ▶
                  </Text>
                </View>

                <View style={styles.videoDuration}>
                  <Text
                    style={styles.videoDurationText}
                  >
                    04:32
                  </Text>
                </View>
              </View>

              <View style={styles.videoContent}>
                <Text style={styles.videoTitle}>
                  Temple Darshan
                </Text>

                <Text style={styles.videoDescription}>
                  Experience the divine atmosphere of the
                  temple.
                </Text>

                <View style={styles.watchRow}>
                  <Text style={styles.watchText}>
                    Watch Video
                  </Text>

                  <Text style={styles.watchArrow}>
                    ›
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* ================================================= */}
            {/* STOTRAS */}
            {/* ================================================= */}

            <View style={styles.sectionHeaderStandalone}>
              <View>
                <Text style={styles.sectionTitle}>
                  Stotras
                </Text>

                <Text style={styles.sectionCaption}>
                  Sacred devotional readings
                </Text>
              </View>
            </View>

            <View style={styles.stotraCard}>
              <Pressable
                style={({ pressed }) => [
                  styles.stotraRow,
                  styles.stotraBorder,
                  pressed && styles.stotraPressed,
                ]}
              >
                <View style={styles.stotraIcon}>
                  <Text style={styles.stotraEmoji}>
                    ॐ
                  </Text>
                </View>

                <View style={styles.stotraContent}>
                  <Text style={styles.stotraTitle}>
                    Sri Narasimha Stotra
                  </Text>

                  <Text
                    style={styles.stotraDescription}
                  >
                    Read the sacred devotional stotra.
                  </Text>

                  <View style={styles.readRow}>
                    <Text style={styles.readText}>
                      Read Stotra
                    </Text>

                    <Text style={styles.readArrow}>
                      ›
                    </Text>
                  </View>
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.stotraRow,
                  styles.stotraBorder,
                  pressed && styles.stotraPressed,
                ]}
              >
                <View style={styles.stotraIcon}>
                  <Text style={styles.stotraEmoji}>
                    ॐ
                  </Text>
                </View>

                <View style={styles.stotraContent}>
                  <Text style={styles.stotraTitle}>
                    Guru Stotra
                  </Text>

                  <Text
                    style={styles.stotraDescription}
                  >
                    Devotional verses dedicated to the Guru.
                  </Text>

                  <View style={styles.readRow}>
                    <Text style={styles.readText}>
                      Read Stotra
                    </Text>

                    <Text style={styles.readArrow}>
                      ›
                    </Text>
                  </View>
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.stotraRow,
                  pressed && styles.stotraPressed,
                ]}
              >
                <View style={styles.stotraIcon}>
                  <Text style={styles.stotraEmoji}>
                    ॐ
                  </Text>
                </View>

                <View style={styles.stotraContent}>
                  <Text style={styles.stotraTitle}>
                    Sharada Stotra
                  </Text>

                  <Text
                    style={styles.stotraDescription}
                  >
                    Sacred verses dedicated to Goddess
                    Sharada.
                  </Text>

                  <View style={styles.readRow}>
                    <Text style={styles.readText}>
                      Read Stotra
                    </Text>

                    <Text style={styles.readArrow}>
                      ›
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>

            {/* ================================================= */}
            {/* AUDIO STOTRAS */}
            {/* ================================================= */}

            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>
                  ♪
                </Text>
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>
                  Audio Stotras
                </Text>

                <Text style={styles.infoText}>
                  Devotional audio playback will be connected
                  when temple media content is available.
                </Text>
              </View>

              <Text style={styles.infoArrow}>
                ›
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* ===================================================== */}
      {/* FULL SCREEN IMAGE VIEWER */}
      {/* ===================================================== */}

      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={closeImage}
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#080706"
          />

          {/* TOP BAR */}

          <View style={styles.modalTopBar}>
            <Pressable
              onPress={closeImage}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.modalPressed,
              ]}
            >
              <Text style={styles.closeButtonText}>
                ×
              </Text>
            </Pressable>

            <View style={styles.modalCounter}>
              <Text style={styles.modalCounterText}>
                {selectedImageIndex !== null
                  ? selectedImageIndex + 1
                  : 1}{' '}
                / {galleryItems.length}
              </Text>
            </View>
          </View>

          {/* IMAGE */}

          {selectedImage && (
            <View style={styles.modalImageContainer}>
              <Image
                source={{
                  uri: getImageUrl(
                    selectedImage.image_url,
                  ),
                }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* PREVIOUS BUTTON */}

          {galleryItems.length > 1 && (
            <Pressable
              onPress={previousImage}
              style={({ pressed }) => [
                styles.navigationButton,
                styles.previousButton,
                pressed && styles.modalPressed,
              ]}
            >
              <Text style={styles.navigationText}>
                ‹
              </Text>
            </Pressable>
          )}

          {/* NEXT BUTTON */}

          {galleryItems.length > 1 && (
            <Pressable
              onPress={nextImage}
              style={({ pressed }) => [
                styles.navigationButton,
                styles.nextButton,
                pressed && styles.modalPressed,
              ]}
            >
              <Text style={styles.navigationText}>
                ›
              </Text>
            </Pressable>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* ================================================= */
  /* CONTAINER */
  /* ================================================= */

  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 45,
  },

  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },

  galleryItemPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },

  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  /* ================================================= */
  /* LOADING / ERROR */
  /* ================================================= */

  loadingContainer: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 12,
    color: '#766A61',
  },

  emptyContainer: {
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#432717',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#766A61',
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F8EBDD',
  },

  retryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A85D25',
  },

  noPhotosCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 10,
  },

  noPhotosTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#432717',
    marginBottom: 6,
  },

  noPhotosText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#81756B',
    textAlign: 'center',
  },

  /* ================================================= */
  /* MAIN HEADER */
  /* ================================================= */

  header: {
    marginBottom: 25,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: '#B66A2C',
    marginBottom: 6,
  },

  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: '#432717',
    letterSpacing: -0.7,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#766A61',
    marginTop: 6,
    maxWidth: 320,
  },

  /* ================================================= */
  /* SECTION HEADER */
  /* ================================================= */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  sectionHeaderStandalone: {
    marginTop: 28,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#432717',
    letterSpacing: -0.2,
  },

  sectionCaption: {
    fontSize: 11,
    color: '#8A7C70',
    marginTop: 3,
  },

  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8EBDD',
  },

  viewAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A85D25',
  },

  viewAllArrow: {
    fontSize: 20,
    lineHeight: 18,
    color: '#A85D25',
    marginLeft: 3,
  },

  /* ================================================= */
  /* MAIN FEATURED IMAGE */
  /* ================================================= */

  previewHero: {
    height: 245,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E6D1BB',
    marginBottom: 13,
  },

  previewHeroImage: {
    width: '100%',
    height: '100%',
  },

  previewOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(26, 16, 10, 0.36)',
  },

  previewContent: {
    position: 'absolute',
    left: 18,
    bottom: 19,
    right: 75,
  },

  previewBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 8,
  },

  previewBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#9C5725',
  },

  previewTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  previewSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 3,
  },

  previewCount: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 51,
    height: 51,
    borderRadius: 17,
    backgroundColor: 'rgba(58,34,20,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewCountNumber: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  previewCountLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  /* ================================================= */
  /* SMALL PREVIEW GRID */
  /* ================================================= */

  smallGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  smallPhotoCard: {
    width: '48.5%',
    height: 130,
    borderRadius: 17,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#E8D7C5',
  },

  smallPhoto: {
    width: '100%',
    height: '100%',
  },

  smallPhotoOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(30,18,10,0.20)',
  },

  smallPhotoTitle: {
    position: 'absolute',
    left: 11,
    right: 8,
    bottom: 10,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ================================================= */
  /* FULL GALLERY HEADER */
  /* ================================================= */

  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  backButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,

    shadowColor: '#4A2C18',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  backArrow: {
    fontSize: 31,
    lineHeight: 34,
    color: '#432717',
    marginTop: -3,
  },

  galleryHeaderText: {
    flex: 1,
  },

  galleryEyebrow: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#B66A2C',
    marginBottom: 3,
  },

  galleryPageTitle: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '800',
    color: '#432717',
  },

  galleryPageSubtitle: {
    fontSize: 10,
    lineHeight: 15,
    color: '#82766C',
    marginTop: 2,
  },

  photoCount: {
    width: 54,
    height: 51,
    borderRadius: 16,
    backgroundColor: '#F8EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  photoCountNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#A85D25',
  },

  photoCountLabel: {
    fontSize: 6.5,
    fontWeight: '900',
    color: '#A85D25',
    letterSpacing: 0.7,
  },

  /* ================================================= */
  /* FULL GALLERY */
  /* ================================================= */

  fullGalleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  fullGalleryWrapper: {
    width: '48.5%',
    marginBottom: 16,
  },

  fullGalleryItem: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#E7D5C0',

    shadowColor: '#4A2C18',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  fullGalleryImage: {
    width: '100%',
    height: '100%',
  },

  galleryTextContainer: {
    paddingHorizontal: 4,
    paddingTop: 7,
  },

  fullGalleryTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    color: '#432717',
  },

  fullGalleryDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: '#7D7066',
    marginTop: 3,
  },

  galleryBottomSpace: {
    height: 20,
  },

  /* ================================================= */
  /* VIDEOS */
  /* ================================================= */

  videoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    marginBottom: 11,

    shadowColor: '#4A2C18',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  videoThumbnail: {
    width: 100,
    height: 82,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#EBD7C0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },

  playIcon: {
    fontSize: 15,
    color: '#A85D25',
  },

  videoDuration: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    backgroundColor: 'rgba(20,12,8,0.72)',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 6,
  },

  videoDurationText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '700',
  },

  videoContent: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 4,
    justifyContent: 'center',
  },

  videoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#432717',
    marginBottom: 4,
  },

  videoDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: '#81756B',
  },

  watchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  watchText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A85D25',
  },

  watchArrow: {
    fontSize: 18,
    color: '#A85D25',
    marginLeft: 2,
  },

  /* ================================================= */
  /* STOTRAS */
  /* ================================================= */

  stotraCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,

    shadowColor: '#4A2C18',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  stotraRow: {
    flexDirection: 'row',
    paddingVertical: 16,
  },

  stotraBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0E7DE',
  },

  stotraPressed: {
    opacity: 0.65,
  },

  stotraIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#F8EBDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  stotraEmoji: {
    fontSize: 20,
    color: '#A85D25',
    fontWeight: '700',
  },

  stotraContent: {
    flex: 1,
  },

  stotraTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#432717',
    marginBottom: 4,
  },

  stotraDescription: {
    fontSize: 10,
    lineHeight: 15,
    color: '#7D7066',
  },

  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  readText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A85D25',
  },

  readArrow: {
    fontSize: 17,
    color: '#A85D25',
    marginLeft: 2,
  },

  /* ================================================= */
  /* AUDIO */
  /* ================================================= */

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3DEC5',
    borderRadius: 20,
    padding: 16,
    marginTop: 18,
  },

  infoIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoIcon: {
    fontSize: 23,
    color: '#A85D25',
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#432717',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 10,
    lineHeight: 15,
    color: '#706258',
  },

  infoArrow: {
    fontSize: 25,
    color: '#A85D25',
    marginLeft: 5,
  },

  /* ================================================= */
  /* FULL SCREEN IMAGE VIEWER */
  /* ================================================= */

  modalContainer: {
    flex: 1,
    backgroundColor: '#080706',
  },

  modalTopBar: {
    position: 'absolute',
    zIndex: 10,
    top: 45,
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  closeButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 31,
    lineHeight: 34,
    fontWeight: '300',
    marginTop: -3,
  },

  modalCounter: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },

  modalCounterText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  modalImageContainer: {
    position: 'absolute',
    top: 90,
    left: 0,
    right: 0,
    bottom: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.65,
  },

  navigationButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.48,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  previousButton: {
    left: 14,
  },

  nextButton: {
    right: 14,
  },

  navigationText: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '300',
    marginTop: -3,
  },

  modalPressed: {
    opacity: 0.55,
    transform: [{ scale: 0.94 }],
  },
});