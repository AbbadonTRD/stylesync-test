import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ShoppingCart as CartIcon, X, MapPin, Calendar, Clock } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { salonInfo } from '@/data/mockData';

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
}

export default function ShoppingCart() {
  const { state, dispatch } = useBooking();
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    name: '',
    email: '',
    phone: '',
  });

  const subtotal = state.selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const discount = (subtotal * appliedDiscount);
  const total = subtotal - discount;

  const handleRemoveProduct = (productId: string) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setAppliedDiscount(0.1); // 10% discount
      toast.success('Rabattcode erfolgreich eingelöst!');
    } else {
      toast.error('Ungültiger Rabattcode');
    }
  };

  const handleCheckout = () => {
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    // Schedule appointment reminder
    if (state.selectedDate) {
      const reminderDate = new Date(state.selectedDate);
      reminderDate.setDate(reminderDate.getDate() - 1);
      
      // Send reminder email
      scheduleReminder({
        type: 'email',
        date: reminderDate,
        recipient: checkoutForm.email,
        booking: {
          date: state.selectedDate,
          time: state.selectedTime,
          package: state.selectedPackage,
          products: state.selectedProducts,
        }
      });
    }

    toast.success('Bestellung erfolgreich aufgegeben!');
    dispatch({ type: 'CLEAR_CART' });
    setShowCheckout(false);
  };

  const scheduleReminder = async (reminder: any) => {
    // In a real application, this would make an API call to schedule the reminder
    console.log('Scheduled reminder:', reminder);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <CartIcon className="h-4 w-4 mr-2" />
          <span>{state.selectedProducts.length} Produkte</span>
          {state.selectedProducts.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {state.selectedProducts.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Warenkorb</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          <div className="flex-1 mt-6">
            {/* Appointment Details */}
            {state.selectedDate && state.selectedTime && (
              <div className="mb-6 p-4 bg-accent/50 rounded-lg space-y-3">
                <h3 className="font-medium">Termin Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(state.selectedDate, 'PPP', { locale: de })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{state.selectedTime} Uhr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{salonInfo.address}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Products List */}
            {state.selectedProducts.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Ihr Warenkorb ist leer
              </div>
            ) : (
              <div className="space-y-4">
                {state.selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                      <p className="font-medium">CHF {product.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Coupon Code */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Rabattcode eingeben"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button onClick={handleApplyCoupon}>
                    Einlösen
                  </Button>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Zwischensumme</span>
                    <span>CHF {subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Rabatt (10%)</span>
                      <span>- CHF {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold">
                    <span>Gesamtsumme</span>
                    <span>CHF {total.toFixed(2)}</span>
                  </div>
                </div>

                {!showCheckout ? (
                  <Button 
                    className="w-full" 
                    onClick={() => setShowCheckout(true)}
                  >
                    Zur Kasse (CHF {total.toFixed(2)})
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={checkoutForm.email}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowCheckout(false)}
                      >
                        Zurück
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={handleCheckout}
                      >
                        Jetzt bestellen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}