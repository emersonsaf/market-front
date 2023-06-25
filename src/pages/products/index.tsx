import { Box, Button, Input, InputLabel, Modal } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { HeaderContent } from '../../components/HeaderContent';

import { FormControl } from '@mui/material';
import { FormModal } from '../../components/FormModal';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../api/products';
import { formatCurrency } from '../../util/formatMoney';
import BodyDataGrid from '../../components/BodyDataGrid';

interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
}

const Products: NextPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [formValue, setFormValue] = useState<Product>({
    name: '',
    description: '',
    price: 0,
  });

  useEffect(() => {
    loadData();
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome', width: 200 },
    { field: 'description', headerName: 'Descrição', width: 450 },
    {
      field: 'price', headerName: 'Preço', width: 150, valueFormatter(product) {
        return `${formatCurrency(product.value)}`
      },
    }
  ];

  async function loadData() {
    let products: Product[] = [];
    try{
     products = await getProducts();
    }catch(e){
      console.log("Erro", e);
    }
    setProducts(products);
  }

  async function handleCreate() {
    await createProduct(formValue);
    loadData();
    setFormValue({
      name: '',
      description: '',
      price: 0,
    });
    setIsModalOpen(false);
  }

  function cleanFormValue() {
    setFormValue({
      name: '',
      description: '',
      price: 0,
    });
  }

  async function handleEdit() {
    if (formValue.id) {
      const projectId = formValue.id;
      const productUpdated = await updateProduct(projectId, formValue);

      const newProducts = products.map((prod) => {
        if (prod.id === productUpdated.id) {
          return { ...productUpdated }
        } else {
          return { ...prod }
        }
      });

      setProducts(newProducts);
      cleanFormValue();
      setIsModalOpen(false);
    }
  }

  async function handleDelete() {
    if (formValue.id) {
      const projectId = formValue.id;
      await deleteProduct(projectId);
      cleanFormValue();
      setIsModalOpen(false);
      const newProducts = products.filter((prod) => prod.id !== projectId);
      setProducts(newProducts);
    }
  }

  return (
    <main className='container'>
      <div className='header'>
        <HeaderContent
          title='Produtos'
          handleAction={() => setIsModalOpen(true)}
        />
      </div>

      <BodyDataGrid>
        <DataGrid
          rows={products}
          columns={columns}
          onRowClick={(product: any) => {
            setFormValue(product.row)
            setIsModalEdit(true)
            setIsModalOpen(true)
          }}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </BodyDataGrid>
      <FormModal
        isModalOpen={isModalOpen}
        onClose={() => {
          cleanFormValue()
          setIsModalOpen(false)
          setIsModalEdit(false)
        }}
      >
        <>
          <InputLabel style={{ fontWeight: 'bold', color: 'black' }}> Cadastro de Produto</InputLabel>
          <FormControl fullWidth>
            <InputLabel htmlFor="name">Nome</InputLabel>
            <Input
              id="name"
              value={formValue.name}
              onChange={(e: any) => {
                setFormValue({
                  ...formValue, name: e.target.value
                })
              }}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel htmlFor="description" >Descrição</InputLabel>
            <Input
              id="description"
              value={formValue.description}
              onChange={(e: any) => {
                setFormValue({
                  ...formValue, description: e.target.value
                })
              }}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel htmlFor="price">Valor</InputLabel>
            <Input
              id="price"
              value={formValue.price}
              onChange={(e: any) => {
                setFormValue({
                  ...formValue, price: e.target.value ? parseInt(e.target.value) : 0
                })
              }}
            />
          </FormControl>
          <Button
            disabled={!formValue.name || !formValue.description || !formValue.price}
            className='button-create'
            variant="contained"
            onClick={() => isModalEdit ? handleEdit() : handleCreate()}
          >
            {
              isModalEdit ? 'Editar' : 'Salvar'
            }
          </Button>
          {
            isModalEdit && (
              <Button
                className='button-delete'
                variant="contained"
                onClick={() => handleDelete()}
              >
                Excluir
              </Button>
            )
          }
        </>
      </FormModal>
    </main>
  )
}

export default Products
