export const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        // Google Maps script already loaded
        resolve();
        return;
      }
  
      // Create a script element to load Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
  
      document.head.appendChild(script);
    });
  };
