import api from './axios';

export interface PurchaseInterface {
    id?: number;
    client_id: number;
    proof_document: string;
    total_value: number;
    purchase_items: PurchaseItemInterface[];
};

export interface PurchaseItemInterface {
    product_id: number;
    amount: number;
    value: number;
};

export interface PurchasePerMonthArrayInterface {
    data: PurchasePerMonthInterface
}

export interface PurchasePerMonthInterface {
    month: string,
    user_name: string,
    total_spent: number
}

export const createPurchase = async (purchaseData: Partial<PurchaseInterface>): Promise<PurchaseInterface> => {
    const response = await api.post('/purchases', purchaseData);
    return response.data;
};

export const getAllPurchase = async (): Promise<PurchaseInterface[]> => {
    const response = await api.get(`/purchases`);
    return response.data;
};

export const getPurchase = async (purchaseId: number): Promise<PurchaseInterface> => {
    const response = await api.get(`/purchases/${purchaseId}`);
    return response.data;
};

export const updatePurchase = async (purchaseId: number, purchaseData: Partial<PurchaseInterface>): Promise<PurchaseInterface> => {
    const response = await api.put(`/purchases/${purchaseId}`, purchaseData);
    return response.data;
};

export const deletePurchase = async (purchaseId: number): Promise<void> => {
    await api.delete(`/purchases/${purchaseId}`);
};

export const getAllPurchasePerMonth = async (): Promise<PurchasePerMonthArrayInterface[]> => {
    const response = await api.get(`/months_with_purchases`);
    return response.data;
};
