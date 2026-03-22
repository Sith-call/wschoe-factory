import { useState, useCallback } from 'react';
import type { Product, ProductCategory } from '../types';
import { getProducts, saveProducts } from '../utils/storage';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => getProducts());

  const addProduct = useCallback((name: string, category: ProductCategory) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      category,
      addedAt: new Date().toISOString(),
    };
    setProducts(prev => {
      const updated = [...prev, newProduct];
      saveProducts(updated);
      return updated;
    });
    return newProduct;
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveProducts(updated);
      return updated;
    });
  }, []);

  const archiveProduct = useCallback((id: string) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, archived: true } : p);
      saveProducts(updated);
      return updated;
    });
  }, []);

  const unarchiveProduct = useCallback((id: string) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, archived: false } : p);
      saveProducts(updated);
      return updated;
    });
  }, []);

  const loadProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
    saveProducts(newProducts);
  }, []);

  const activeProducts = products.filter(p => !p.archived);
  const archivedProducts = products.filter(p => p.archived);

  return {
    products,
    activeProducts,
    archivedProducts,
    addProduct,
    removeProduct,
    archiveProduct,
    unarchiveProduct,
    loadProducts,
  };
}
