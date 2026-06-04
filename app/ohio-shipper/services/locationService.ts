import * as Location from 'expo-location';

export type LocationCoordinates = {
  latitude: number;
  longitude: number;
};

export const locationService = {
  /**
   * Request permission to access device location
   */
  requestPermission: async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('[Location] Permission request failed:', error);
      return false;
    }
  },

  /**
   * Get current device location
   */
  getCurrentLocation: async (): Promise<LocationCoordinates | null> => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const hasPermission = await locationService.requestPermission();
        if (!hasPermission) {
          console.warn('[Location] Permission not granted');
          return null;
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('[Location] Get current location failed:', error);
      return null;
    }
  },

  /**
   * Watch location changes (for continuous tracking)
   * Returns a subscription function to stop watching
   */
  watchLocation: (
    callback: (location: LocationCoordinates) => void,
    options?: { accuracy?: Location.Accuracy; distanceInterval?: number }
  ): (() => void) => {
    const subscription = Location.watchPositionAsync(
      {
        accuracy: options?.accuracy ?? Location.Accuracy.High,
        distanceInterval: options?.distanceInterval ?? 10, // Update every 10 meters
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );

    return () => {
      subscription.then((sub) => sub.remove());
    };
  },
};
