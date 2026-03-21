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
    const updated = [...products, newProduct];
    setProducts(updated);
    saveProducts(updated);
    return newProduct;
  }, [products]);

  const removeProduct = useCallback((id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  }, [products]);

  const archiveProduct = useCallback((id: string) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, archived: true } : p
    );
    setProducts(updated);
    saveProducts(updated);
  }, [products]);

  const unarchiveProduct = useCallback((id: string) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, archived: false } : p
    );
    setProducts(updated);
    saveProducts(updated);
  }, [products]);

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
