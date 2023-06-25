import api from './axios';

interface Client {
  id: number;
  name: string;
  birth_date: string;
}

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get('/clients');
  return response.data;
};

export const getClient = async (clientId: number): Promise<Client> => {
  const response = await api.get(`/clients/${clientId}`);
  return response.data;
};

export const createClient = async (clientData: Partial<Client>): Promise<Client> => {
  const response = await api.post('/clients', clientData);
  return response.data;
};

export const updateClient = async (clientId: number, clientData: Partial<Client>): Promise<Client> => {
  const response = await api.put(`/clients/${clientId}`, clientData);
  return response.data;
};

export const deleteClient = async (clientId: number): Promise<void> => {
  await api.delete(`/clients/${clientId}`);
};
