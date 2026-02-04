'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  image?: string;
  variant?: {
    id: number;
    sku?: string;
    attributes?: Record<string, unknown>[];
  };
}

interface Cart {
  id: string;
  version: number;
  items: CartItem[];
  totalPrice: number;
  currency: string;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, variantId?: number, quantity?: number, productData?: { name: string; price: number; currency: string; image?: string }) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bt-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('bt-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem('bt-cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = async (
    productId: string,
    variantId: number = 1,
    quantity: number = 1,
    productData?: { name: string; price: number; currency: string; image?: string }
  ) => {
    setLoading(true);
    try {
      // For now, use local cart management
      // In production, this would call the commercetools API
      const newItem: CartItem = {
        id: `${productId}-${variantId}-${Date.now()}`,
        productId,
        name: productData?.name || 'Product',
        quantity,
        price: productData?.price || 0,
        currency: productData?.currency || 'USD',
        image: productData?.image,
        variant: { id: variantId },
      };

      setCart(prevCart => {
        if (!prevCart) {
          return {
            id: `local-${Date.now()}`,
            version: 1,
            items: [newItem],
            totalPrice: newItem.price * quantity,
            currency: newItem.currency,
          };
        }

        // Check if item already exists
        const existingIndex = prevCart.items.findIndex(
          item => item.productId === productId && item.variant?.id === variantId
        );

        let newItems: CartItem[];
        if (existingIndex >= 0) {
          newItems = [...prevCart.items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
        } else {
          newItems = [...prevCart.items, newItem];
        }

        const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return {
          ...prevCart,
          version: prevCart.version + 1,
          items: newItems,
          totalPrice,
        };
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (lineItemId: string) => {
    setLoading(true);
    try {
      setCart(prevCart => {
        if (!prevCart) return null;

        const newItems = prevCart.items.filter(item => item.id !== lineItemId);
        const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (newItems.length === 0) {
          localStorage.removeItem('bt-cart');
          return null;
        }

        return {
          ...prevCart,
          version: prevCart.version + 1,
          items: newItems,
          totalPrice,
        };
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (lineItemId: string, quantity: number) => {
    setLoading(true);
    try {
      if (quantity <= 0) {
        await removeFromCart(lineItemId);
        return;
      }

      setCart(prevCart => {
        if (!prevCart) return null;

        const newItems = prevCart.items.map(item =>
          item.id === lineItemId ? { ...item, quantity } : item
        );
        const totalPrice = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return {
          ...prevCart,
          version: prevCart.version + 1,
          items: newItems,
          totalPrice,
        };
      });
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
