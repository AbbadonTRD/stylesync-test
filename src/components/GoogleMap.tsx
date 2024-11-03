import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  address: string;
}

export default function GoogleMap({ address }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (!mapRef.current) return;

      // Initialize the map
      const map = new google.maps.Map(mapRef.current, {
        zoom: 15,
        center: { lat: 47.5572101, lng: 8.8943399 }, // Default coordinates for Frauenfeld
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // Create a marker for the salon
      const marker = new google.maps.Marker({
        map,
        position: { lat: 47.5572101, lng: 8.8943399 },
        title: 'Meliyah afro-shop',
      });

      // Create an info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: 600;">Meliyah afro-shop</h3>
            <p style="margin: 0; color: #666;">${address}</p>
          </div>
        `,
      });

      // Show info window when marker is clicked
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Open info window by default
      infoWindow.open(map, marker);
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [address]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[300px] bg-accent"
      aria-label="Salon location map"
    />
  );
}