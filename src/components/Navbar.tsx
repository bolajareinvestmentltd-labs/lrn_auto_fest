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
                <Link href="/register" className="text-white font-sans hover:text-brand-blue transition-colors px-3 py-2">Register</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/tickets" className="text-white font-sans hover:text-brand-blue transition-colors px-3 py-2">Tickets</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/vip" className="text-white font-sans hover:text-brand-blue transition-colors px-3 py-2">VIP</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/vendors" className="text-white font-sans hover:text-brand-blue transition-colors px-3 py-2">Vendors</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/merchandise" className="text-white font-sans hover:text-brand-orange transition-colors px-3 py-2">Merch</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/logistics" className="text-white font-sans hover:text-blue-400 transition-colors px-3 py-2">Logistics</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/gallery" className="text-white font-sans hover:text-brand-blue transition-colors px-3 py-2">Gallery</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/map" className="text-white font-sans hover:text-brand-blue transition-colors px-3 py-2">Map</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/live" className="text-white font-sans hover:text-brand-blue transition-colors px-3 py-2 flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/faq" className="text-white font-sans hover:text-brand-blue transition-colors px-3 py-2">FAQ</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" className="text-white font-sans hover:text-brand-blue transition-colors px-3 py-2">Contact</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Buy Tickets Button - Right Side */}
        <div className="hidden md:block">
          <Link href="/tickets">
            <Button className="bg-brand-orange hover:bg-orange-600 text-white font-bold">Get Tickets</Button>
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
                <Link href="/register" className="text-white font-sans hover:text-brand-blue transition-colors text-lg">Register</Link>
                <Link href="/tickets" className="text-white font-sans hover:text-brand-blue transition-colors text-lg">Tickets</Link>
                <Link href="/vip" className="text-white font-sans hover:text-brand-blue transition-colors text-lg">VIP Packages</Link>
                <Link href="/vendors" className="text-white font-sans hover:text-brand-blue transition-colors text-lg">Vendors</Link>
                <Link href="/merchandise" className="text-white font-sans hover:text-brand-orange transition-colors text-lg">Merchandise</Link>
                <Link href="/logistics" className="text-white font-sans hover:text-blue-400 transition-colors text-lg">🚌 Logistics</Link>
                <Link href="/gallery" className="text-white font-sans hover:text-brand-blue transition-colors text-lg">Gallery</Link>
                <Link href="/map" className="text-white font-sans hover:text-brand-blue transition-colors text-lg">Event Map</Link>
                <Link href="/live" className="text-white font-sans hover:text-brand-blue transition-colors text-lg flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live Dashboard
                </Link>
                <Link href="/faq" className="text-white font-sans hover:text-brand-blue transition-colors text-lg">FAQ</Link>
                <Link href="/contact" className="text-white font-sans hover:text-brand-blue transition-colors text-lg">Contact</Link>
                <hr className="border-white/20 my-2" />
                <Link href="/gate" className="text-amber-400 font-sans hover:text-amber-300 transition-colors text-lg flex items-center gap-2">
                  🎫 Gate Check-In (Staff)
                </Link>
                <Link href="/admin" className="text-amber-400 font-sans hover:text-amber-300 transition-colors text-lg flex items-center gap-2">
                  ⚙️ Admin Dashboard
                </Link>
                <Link href="/tickets">
                  <Button className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold mt-6">
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