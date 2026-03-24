import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Logo - Left Side */}
        <Link href="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity" aria-label="IAF 2026 Home">
          <Image
            src="/images/logo.png"
            alt="Ilorin Automotive Festival"
            width={60}
            height={60}
            priority
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              <NavigationMenuItem>
                <Link href="/register" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Performer</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/tickets" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Tickets</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/vip" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">VIP</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/vendors" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Vendors</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/merchandise" className="font-sans font-medium text-white/80 hover:text-brand-orange transition-colors px-3 py-2 text-sm tracking-widest uppercase">Merch</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/logistics" className="font-sans font-medium text-white/80 hover:text-blue-400 transition-colors px-3 py-2 text-sm tracking-widest uppercase">Logistics</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/gallery" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Gallery</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/map" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Map</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/live" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/faq" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">FAQ</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors px-3 py-2 text-sm tracking-widest uppercase">Contact</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Buy Tickets Button - Right Side */}
        <div className="hidden md:block">
          <Link href="/tickets">
            <Button className="bg-brand-orange hover:bg-orange-600 text-white font-sans font-semibold text-xs uppercase tracking-widest px-5">Get Tickets</Button>
          </Link>
        </div>

        {/* Mobile Navigation - Logo Menu Drawer */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="text-white text-2xl p-0 h-auto w-auto" aria-label="Open menu">☰</Button>
            </SheetTrigger>
            <SheetContent className="bg-[#050505] text-white border-l border-white/10">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/register" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">Performer</Link>
                <Link href="/tickets" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">Tickets</Link>
                <Link href="/vip" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">VIP Packages</Link>
                <Link href="/vendors" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">Vendors</Link>
                <Link href="/merchandise" className="font-sans font-medium text-white/80 hover:text-brand-orange transition-colors text-sm tracking-widest uppercase">Merchandise</Link>
                <Link href="/logistics" className="font-sans font-medium text-white/80 hover:text-blue-400 transition-colors text-sm tracking-widest uppercase">🚌 Logistics</Link>
                <Link href="/gallery" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">Gallery</Link>
                <Link href="/map" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">Event Map</Link>
                <Link href="/live" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live Dashboard
                </Link>
                <Link href="/faq" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">FAQ</Link>
                <Link href="/contact" className="font-sans font-medium text-white/80 hover:text-brand-blue transition-colors text-sm tracking-widest uppercase">Contact</Link>
                <hr className="border-white/20 my-2" />
                <Link href="/gate" className="font-sans font-medium text-amber-400 hover:text-amber-300 transition-colors text-sm tracking-widest uppercase flex items-center gap-2">
                  🎫 Gate Check-In (Staff)
                </Link>
                <Link href="/admin" className="font-sans font-medium text-amber-400 hover:text-amber-300 transition-colors text-sm tracking-widest uppercase flex items-center gap-2">
                  ⚙️ Admin Dashboard
                </Link>
                <Link href="/tickets">
                  <Button className="w-full bg-brand-orange hover:bg-orange-600 text-white font-sans font-semibold text-xs uppercase tracking-widest mt-6">
                    Get Tickets
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;