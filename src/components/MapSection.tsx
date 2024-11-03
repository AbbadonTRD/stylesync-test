import { Card, CardContent } from '@/components/ui/card';
import { salonInfo } from '@/data/mockData';

export default function MapSection() {
  // Google Maps embed URL with proper API key placeholder
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=Meliyah+afro-shop,Frauenfeld+Switzerland&zoom=16`;

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Standort</h2>
      <Card>
        <CardContent className="p-6">
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
            />
          </div>
          <div className="mt-4 space-y-2">
            <p className="font-medium">{salonInfo.name}</p>
            <p className="text-muted-foreground">{salonInfo.address}</p>
            <p className="text-muted-foreground">Tel: {salonInfo.phone}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}