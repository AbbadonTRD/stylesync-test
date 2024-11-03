import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/data/mockData';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from 'sonner';

export default function ProductRecommendations() {
  const { dispatch } = useBooking();

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
      toast.success('Produkt zum Warenkorb hinzugefügt');
    }
  };

  // Show only 3 recommended products
  const recommendedProducts = products.slice(0, 3);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Empfohlene Produkte</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedProducts.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="p-0">
              <div className="aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <CardTitle className="text-base mb-2">{product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="mt-2 font-bold">CHF {product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => handleAddToCart(product.id)}
              >
                Zum Warenkorb hinzufügen
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}