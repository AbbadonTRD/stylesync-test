import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { ThemeToggle } from './theme-toggle';
import ShoppingCart from './ShoppingCart';

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem className="flex items-center space-x-2">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <img src="/scissors.svg" alt="Logo" className="h-6 w-6" />
                  <span className="text-xl font-bold">Meliyah afro-shop</span>
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  onClick={() => navigate('/booking')}
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  Termin buchen
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  onClick={() => navigate('/shop')}
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  Shop
                </button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <button
                  onClick={() => navigate('/admin')}
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  Admin
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ShoppingCart />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Meliyah afro-shop. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}