import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { salonInfo } from '@/data/mockData';

export default function BusinessInfo() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Kontaktdaten / Öffnungszeiten</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              Adresse
            </div>
            <p className="text-muted-foreground">
              {salonInfo.address}
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Phone className="h-5 w-5 text-primary" />
              Kontakt
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {salonInfo.phone}
              </p>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {salonInfo.email}
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Clock className="h-5 w-5 text-primary" />
              Öffnungszeiten
            </div>
            <ul className="space-y-2">
              {Object.entries(salonInfo.openingHours).map(([day, hours]) => (
                <li key={day} className="flex justify-between items-center">
                  <span>{day}</span>
                  <span className={hours.open === 'Geschlossen' ? 'text-red-500' : ''}>
                    {hours.open === 'Geschlossen' 
                      ? 'Geschlossen' 
                      : `${hours.open} - ${hours.close}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}