import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { HeaderContent } from "../../components/HeaderContent";
import { PurchaseInterface, PurchaseItemInterface, createPurchase, deletePurchase, getAllPurchase, updatePurchase } from "../api/purchase";
import { getClients } from "../api/clients";
import BodyDataGrid from "../../components/BodyDataGrid";
import { formatCurrency } from "../../util/formatMoney";
import { FormModal } from "../../components/FormModal";
import { Button, FormControl, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { ProductInterface, getProducts } from "../api/products";

import DeleteIcon from '@mui/icons-material/Delete';

interface ClientInterface {
  id: number,
  name: string,
  birth_date: string
}

const Purchases: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);

  const [formValue, setFormValue] = useState<any>({
    client_id: 0,
    total_value: 0,
    proof_document: '',
    purchase_items_attributes: []
  });

  const [clients, setClients] = useState<ClientInterface[]>([]);
  const [purchases, setPurchases] = useState<PurchaseInterface[]>([]);
  const [products, setProducts] = useState<ProductInterface[]>([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'client_id', headerName: 'Cliente', width: 400, valueFormatter(params) {
        return clients.filter((client) => client.id === params.value)[0].name;
      },
    },
    { field: 'proof_document', headerName: 'Numero da NF', width: 200 },
    {
      field: 'total_value', headerName: 'Valor total', width: 200, valueFormatter(params) {
        return `${formatCurrency(params.value)}`
      },
    },
  ];

  function cleanFormValue() {
    setFormValue({
      client_id: 0,
      total_value: 0,
      proof_document: '',
      purchase_items: []
    });
  }

  useEffect(() => {
    loadClient();
    loadData();
    loadProducts();
  }, []);

  async function loadClient() {
    try {
      const data = await getClients();
      setClients(data);
    } catch (e) {
      console.log("Erro", e);
    }
  }


  async function loadProducts() {
    let products: ProductInterface[] = [];
    try {
      products = await getProducts();
    } catch (e) {
      console.log("Erro", e);
    }
    setProducts(products);
  }


  async function loadData() {
    let purchases: PurchaseInterface[] = [];
    try {
      purchases = await getAllPurchase();
    } catch (e) {
      console.log("Erro", e);
    }
    setPurchases(purchases);
  }

  async function handleAddEmptyProduct() {
    let purchItems = formValue.purchase_items || [];
    purchItems.push({
      product_id: 0,
      amount: 0,
      value: 0
    });
    setFormValue({ ...formValue, purchase_items: purchItems });
  }

  async function handleSelectProduct(prod: any, key: number) {
    let newFormValue = formValue.purchase_items.map((form: PurchaseItemInterface, index: number) => {
      if (index === key) {
        return { product_id: prod, amount: 0, value: 0 }
      } else {
        return { ...form }
      }
    });
    setFormValue({ ...formValue, purchase_items: newFormValue });
  }

  async function handleChangeAmountProduct(amount: any, product_id: number, key: number) {
    const product = await products.filter((prod) => prod.id === product_id)[0];
    const valueTotal = product.price * amount;
    let newFormValue = await formValue.purchase_items.map((item: PurchaseItemInterface, index: number) => {
      if (index === key) {
        return { ...item, amount: amount, value: valueTotal }
      } else {
        return { ...item }
      }
    });

    setFormValue({ ...formValue, purchase_items: newFormValue });
  }

  async function handleDeleteProductList(index: number) {
    let newFormValue = await formValue.purchase_items.filter((items, key: number) => key !== index);
    setFormValue({ ...formValue, purchase_items: newFormValue });
  }

  async function handleCreate() {
    let totalValues = 0;
    formValue.purchase_items.map((items: PurchaseItemInterface) => {
      totalValues += items.value;
    })
    try {
      await createPurchase({ ...formValue, total_value: totalValues, purchase_items_attributes: formValue.purchase_items });
    } catch (e) {
      console.log("Erro", e);
    }

    loadData()
    cleanFormValue();
    setIsModalOpen(false);
  }

  async function handleEdit() {
    let totalValues = 0;
    formValue.purchase_items.map((items: PurchaseItemInterface) => {
      totalValues += items.value;
    })
    try {
      await updatePurchase(formValue.id, { ...formValue, total_value: totalValues, purchase_items_attributes: formValue.purchase_items });
    } catch (e) {
      console.log("Erro", e);
    }

    loadData()
    cleanFormValue();
    setIsModalOpen(false);
  }

  async function handleDelete() {
    if(formValue.id){
      await deletePurchase(formValue.id)
    }

    loadData()
    cleanFormValue();
    setIsModalOpen(false);
  }

  return (
    <main className='container'>
      <div className='header'>
        <HeaderContent
          title='Compras'
          handleAction={() => setIsModalOpen(true)}
        />
      </div>
      <BodyDataGrid>
        <DataGrid
          rows={purchases}
          columns={columns}
          onRowClick={(purchase: any) => {
            setFormValue(purchase.row)
            setIsModalEdit(true)
            setIsModalOpen(true)
          }}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </BodyDataGrid>
      <FormModal
        isModalOpen={isModalOpen}
        size={800}
        onClose={() => {
          setIsModalOpen(false)
          setIsModalEdit(false)
          cleanFormValue()
        }}
      >
        <>
          <div style={{ width: '660px' }}>
            <InputLabel style={{ fontWeight: 'bold', color: 'black', marginBottom: '1rem' }}>Nova Compra</InputLabel>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormControl size="medium">
                <InputLabel id="demo-simple-select-label">Cliente</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formValue.client_id}
                  style={{ width: '200px' }}
                  label="Cliente"
                  onChange={(client) => setFormValue({ ...formValue, client_id: client.target.value })}
                >
                  {
                    clients.map((client) => (<MenuItem value={client.id}>{client.name}</MenuItem>))
                  }
                </Select>
              </FormControl>
              <Button
                className='button-create'
                variant="contained"
                style={{ width: '200px' }}
                onClick={() => handleAddEmptyProduct()}
              >
                Adicionar produto
              </Button>
            </div>
            <div>
              {
                formValue.purchase_items?.map((item: PurchaseItemInterface, key: number) =>
                  <div key={key} style={{ display: 'flex', gap: '1rem' }}>
                    <FormControl>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={item.product_id}
                        style={{ width: '200px', marginTop: '1rem' }}
                        label="Produto"
                        onChange={(prod) => handleSelectProduct(prod.target.value, key)}
                      >
                        {
                          products.map((prod) => (<MenuItem value={prod.id}>{prod.name}</MenuItem>))
                        }
                      </Select>
                    </FormControl>
                    <TextField
                      label="Quantidade"
                      value={item.amount}
                      variant="outlined"
                      style={{ marginLeft: '1rem', marginTop: '1rem' }}
                      onChange={(value) => handleChangeAmountProduct(value.target.value, item.product_id, key)}
                    />
                    <TextField
                      disabled
                      label="Total"
                      value={formatCurrency(item.value)}
                      variant="outlined"
                      style={{ marginTop: '1rem' }}
                    />
                    <DeleteIcon
                      fontSize="large"
                      color="error"
                      style={{ marginTop: '1.25rem' }}
                      onClick={() => handleDeleteProductList(key)}
                    />
                  </div>
                )
              }
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button
                className='button-create'
                variant="contained"
                style={{ marginTop: '1rem' }}
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
                    variant="outlined"
                    style={{ marginTop: '1rem', color: 'black' }}
                    onClick={() => handleDelete()}
                  >
                    Excluir
                  </Button>
                )
              }
            </div>
          </div>
        </>
      </FormModal>
    </main >
  )
}

export default Purchases;