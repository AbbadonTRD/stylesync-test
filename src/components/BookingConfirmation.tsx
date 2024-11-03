import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooking } from '@/contexts/BookingContext';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import ProductRecommendations from './ProductRecommendations';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import PaymentForm from './PaymentForm';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { scheduleReminder } from '@/lib/reminders';

export default function BookingConfirmation() {
  const { state, dispatch } = useBooking();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    acceptTerms: false,
    marketingConsent: false
  });

  const totalPrice = (state.selectedPackage?.services || []).reduce((sum, service) => sum + service.price, 0) +
    state.selectedProducts.reduce((sum, product) => sum + product.price, 0);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Email-Adresse ist erforderlich');
      return;
    }
    
    if (!formData.acceptTerms) {
      toast.error('Bitte akzeptieren Sie die AGB');
      return;
    }

    const booking = {
      id: Date.now().toString(),
      customerId: formData.name,
      packageId: state.selectedPackage?.id || '',
      employeeId: state.selectedEmployee?.id || '',
      date: state.selectedDate ? format(state.selectedDate, 'yyyy-MM-dd') : '',
      time: state.selectedTime || '',
      status: 'pending',
      totalPrice,
      products: state.selectedProducts,
      reminderEmail: true,
      reminderSMS: !!formData.phone,
      paymentStatus: 'pending',
      marketingConsent: formData.marketingConsent,
      packageName: state.selectedPackage?.name
    };

    dispatch({ type: 'ADD_BOOKING', payload: booking });
    setShowPayment(true);
    toast.success('Buchungsdetails bestätigt');

    // Schedule automatic reminder
    if (state.selectedDate) {
      const reminderDate = new Date(state.selectedDate);
      reminderDate.setDate(reminderDate.getDate() - 1);
      
      scheduleReminder({
        type: 'email',
        date: reminderDate,
        recipient: formData.email,
        booking
      });
    }
  };

  const handlePaymentComplete = (paymentMethod: string) => {
    setPaymentStatus('success');
    dispatch({ type: 'RESET_BOOKING' });
    localStorage.removeItem('selectedPackage');
    toast.success('Buchung erfolgreich abgeschlossen!');
  };

  if (!state.selectedPackage) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            {paymentStatus === 'success' ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  Vielen Dank für Ihre Buchung! ✅
                </AlertDescription>
              </Alert>
            ) : paymentStatus === 'failed' ? (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800">
                  Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut oder wählen Sie eine andere Zahlungsmethode.
                </AlertDescription>
              </Alert>
            ) : (
              <p>Bitte wählen Sie zuerst ein Paket aus.</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buchungsübersicht</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.selectedDate && state.selectedTime && (
            <div>
              <h3 className="font-medium">Termin</h3>
              <p>{format(state.selectedDate, 'PPP', { locale: de })} um {state.selectedTime}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium">Gewähltes Paket</h3>
            <p>{state.selectedPackage.name} - CHF {state.selectedPackage.price.toFixed(2)}</p>
          </div>

          {state.selectedPackage.services.length > 0 && (
            <div>
              <h3 className="font-medium">Enthaltene Services</h3>
              <ul className="list-disc list-inside">
                {state.selectedPackage.services.map(service => (
                  <li key={service.id}>
                    {service.name} - CHF {service.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {!showPayment ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Wird für Terminbestätigung und Erinnerung benötigt
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                  }
                  required
                />
                <Label htmlFor="terms">
                  Ich akzeptiere die AGB und Datenschutzerklärung *
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="marketing"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, marketingConsent: checked as boolean }))
                  }
                />
                <Label htmlFor="marketing">
                  Ich möchte Newsletter und Angebote erhalten
                </Label>
              </div>

              <Button type="submit" className="w-full">
                Weiter zur Zahlung
              </Button>
            </form>
          ) : (
            <PaymentForm 
              total={totalPrice} 
              onSubmit={handlePaymentComplete}
            />
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            * Pflichtfelder
          </p>
        </CardFooter>
      </Card>

      {!showPayment && <ProductRecommendations />}
    </div>
  );
}