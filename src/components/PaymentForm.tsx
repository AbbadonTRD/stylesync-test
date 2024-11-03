import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentDetails } from '@/types';
import { CreditCard, Smartphone, Banknote } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFormProps {
  total: number;
  onSubmit: (paymentMethod: string, details?: PaymentDetails) => void;
}

export default function PaymentForm({ total, onSubmit }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'twint' | 'cash'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  const validateCardDetails = () => {
    if (paymentMethod !== 'card') return true;
    
    const cardNumberValid = paymentDetails.cardNumber.replace(/\s/g, '').length === 16;
    const expiryValid = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentDetails.expiryDate);
    const cvvValid = /^[0-9]{3,4}$/.test(paymentDetails.cvv);
    const nameValid = paymentDetails.name.length > 3;

    return cardNumberValid && expiryValid && cvvValid && nameValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCardDetails()) {
      toast.error('Bitte überprüfen Sie Ihre Zahlungsinformationen');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (paymentMethod === 'twint') {
        // Show TWINT QR code and wait for confirmation
        const confirmed = window.confirm('Bitte scannen Sie den TWINT QR-Code und bestätigen Sie die Zahlung');
        if (!confirmed) {
          throw new Error('TWINT-Zahlung abgebrochen');
        }
      }

      onSubmit(paymentMethod, paymentMethod === 'card' ? paymentDetails : undefined);
      toast.success('Zahlung erfolgreich verarbeitet');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Zahlung fehlgeschlagen');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zahlung</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Zahlungsmethode</Label>
            <RadioGroup
              defaultValue="card"
              onValueChange={(value) => setPaymentMethod(value as 'card' | 'twint' | 'cash')}
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="card"
                  id="card"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <CreditCard className="mb-2 h-6 w-6" />
                  Kreditkarte
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="twint"
                  id="twint"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="twint"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Smartphone className="mb-2 h-6 w-6" />
                  TWINT
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="cash"
                  id="cash"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="cash"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <Banknote className="mb-2 h-6 w-6" />
                  Bar
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name auf der Karte</Label>
                <Input
                  id="name"
                  placeholder="Max Mustermann"
                  value={paymentDetails.name}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Kartennummer</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                    setPaymentDetails({ ...paymentDetails, cardNumber: value });
                  }}
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Gültig bis</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentDetails.expiryDate}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, '')
                        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
                        .slice(0, 5);
                      setPaymentDetails({ ...paymentDetails, expiryDate: value });
                    }}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setPaymentDetails({ ...paymentDetails, cvv: value });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'twint' && (
            <div className="text-center p-4">
              <p className="text-lg font-medium mb-2">TWINT QR-Code</p>
              <p className="text-muted-foreground">
                Scannen Sie den QR-Code mit Ihrer TWINT App
              </p>
              <div className="w-48 h-48 mx-auto my-4 bg-muted rounded-lg flex items-center justify-center">
                QR Code wird geladen...
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Gesamtbetrag</p>
              <p className="text-2xl font-bold">CHF {total.toFixed(2)}</p>
            </div>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? 'Wird verarbeitet...' : (
                paymentMethod === 'cash' ? 'Vor Ort bezahlen' : 'Jetzt bezahlen'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}