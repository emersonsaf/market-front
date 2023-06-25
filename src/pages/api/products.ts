import api from './axios';

export interface ProductInterface {
  id: number;
  name: string;
  price: number;
  description: string;
}

export const getProducts = async (): Promise<ProductInterface[]> => {
  const response = await api.get('/products');
  return response.data;
};

export const getProduct = async (productId: number): Promise<ProductInterface> => {
  const response = await api.get(`/products/${productId}`);
  return response.data;
};

export const createProduct = async (productData: Partial<ProductInterface>): Promise<ProductInterface> => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (productId: number, productData: Partial<ProductInterface>): Promise<ProductInterface> => {
  const response = await api.put(`/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await api.delete(`/products/${productId}`);
};
