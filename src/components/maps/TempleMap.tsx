import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin } from 'lucide-react';

interface TempleMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    coordinates: [number, number];
    title: string;
    description?: string;
    color?: string;
  }>;
}

export const TempleMap = ({ 
  center = [72.8777, 21.5222], // Default to Gujarat
  zoom = 8,
  markers = []
}: TempleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !isTokenSet || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add markers
    markers.forEach((marker) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundColor = marker.color || '#FF9933';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3 style="font-weight: bold; margin-bottom: 4px;">${marker.title}</h3>
         ${marker.description ? `<p style="font-size: 14px;">${marker.description}</p>` : ''}`
      );

      new mapboxgl.Marker(el)
        .setLngLat(marker.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [isTokenSet, mapboxToken, center, zoom, markers]);

  if (!isTokenSet) {
    return (
      <div className="space-y-4 p-6 bg-muted rounded-lg">
        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            To display maps, please enter your Mapbox Public Token. Get one for free at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
          <div className="flex gap-2">
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <button
              onClick={() => setIsTokenSet(true)}
              disabled={!mapboxToken.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
            >
              Set Token
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
    </div>
  );
};
