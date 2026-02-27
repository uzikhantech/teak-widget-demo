import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, Menu, X, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Header() {
    const itemCount = useCartStore((state) => state.getItemCount());
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <Ticket className="h-6 w-6 text-neutral-900" />
                    <span className="text-xl font-semibold tracking-tight text-neutral-900">
                        RefundTix
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `text-sm font-medium transition-colors hover:text-neutral-900 ${isActive ? "text-neutral-900" : "text-neutral-600"
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/events"
                        className={({ isActive }) =>
                            `text-sm font-medium transition-colors hover:text-neutral-900 ${isActive ? "text-neutral-900" : "text-neutral-600"
                            }`
                        }
                    >
                        Events
                    </NavLink>
                    <NavLink
                        to="/account"
                        className={({ isActive }) =>
                            `text-sm font-medium transition-colors hover:text-neutral-900 ${isActive ? "text-neutral-900" : "text-neutral-600"
                            }`
                        }
                    >
                        Account
                    </NavLink>
                </nav>

                {/* Cart Button */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => setCartOpen(true)}
                        aria-label={`Shopping cart with ${itemCount} items`}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <Badge
                                variant="default"
                                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                            >
                                {itemCount > 99 ? "99+" : itemCount}
                            </Badge>
                        )}
                    </Button>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-neutral-200 bg-white md:hidden">
                    <nav className="flex flex-col space-y-1 px-4 py-4">
                        <NavLink
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-neutral-100 text-neutral-900"
                                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/events"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-neutral-100 text-neutral-900"
                                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                }`
                            }
                        >
                            Events
                        </NavLink>
                        <NavLink
                            to="/account"
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-neutral-100 text-neutral-900"
                                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                }`
                            }
                        >
                            Account
                        </NavLink>
                    </nav>
                </div>
            )}

            <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
        </header>
    );
}
