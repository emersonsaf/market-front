import { Button, FormControl, Input, InputLabel, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { FormModal } from '../../components/FormModal';
import { HeaderContent } from '../../components/HeaderContent';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { createClient, deleteClient, getClients, updateClient } from '../api/clients';
import { convertDate, formatDateBR } from '../../util/formatData';
import BodyDataGrid from '../../components/BodyDataGrid';


interface Client {
  id?: number,
  name: string,
  birth_date: string
}

const Clients: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [formValue, setFormValue] = useState<Client>({
    name: '',
    birth_date: '',
  });
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    loadData();
  }, [])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nome', width: 600 },
    {
      field: 'birth_date', headerName: 'Data de Nascimento', width: 200, valueFormatter(params) {
        return formatDateBR(params.value)
      },
    }
  ];

  async function loadData() {
    let newData: Client[] = [];
    try {
      const data = await getClients();
      await data.map((client: Client) => {
        newData.push({
          ...client, birth_date: client.birth_date
        })
      });
    } catch (e) {
      console.log("Erro", e);
    }

    setClients(newData);
  }

  function cleanFormValue() {
    setFormValue({
      name: '',
      birth_date: ''
    });
  }

  async function handleEdit() {
    if (formValue.id) {
      const clientId = formValue.id;
      const clientUpdated = await updateClient(clientId, formValue);

      const clientsUpdated = clients.map((client) => {
        if (client.id === clientUpdated.id) {
          return { ...clientUpdated, birth_date: clientUpdated.birth_date }
        } else {
          return { ...client }
        }
      });
      setClients(clientsUpdated);
      cleanFormValue();
      setIsOpen(false);
    }
  }

  async function handleDelete() {
    if (formValue.id) {
      const clientId = formValue.id;
      await deleteClient(clientId);
      cleanFormValue();
      setIsOpen(false);
      const newClients = clients.filter((client) => client.id !== clientId);
      setClients(newClients);
    }
  }

  async function handleCreate() {
    await createClient(formValue);
    await loadData();
    cleanFormValue();
    setIsOpen(false);
    return;
  }



  return (
    <main className='container'>
      <div className='header'>
        <HeaderContent
          title='Clientes'
          handleAction={() => setIsOpen(true)}
        />
      </div>

      <BodyDataGrid>
        <DataGrid
          rows={clients}
          columns={columns}
          onRowClick={(client: any) => {
            setFormValue(client.row)
            setIsModalEdit(true)
            setIsOpen(true)
          }}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </BodyDataGrid>
      <FormModal
        isModalOpen={isOpen}
        onClose={() => {
          cleanFormValue()
          setIsOpen(false)
          setIsModalEdit(false)
        }}
      >
        <>
          <InputLabel style={{ fontWeight: 'bold', color: 'black' }}> Cadastro de Cliente</InputLabel>
          <FormControl fullWidth>
            <InputLabel htmlFor="name">Nome</InputLabel>
            <Input
              id="name"
              value={formValue.name}
              onChange={(e) => {
                setFormValue({
                  ...formValue, name: e.target.value
                })
              }}
            />
          </FormControl>
          <FormControl fullWidth>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Data de nascimento"
                value={formValue.birth_date}
                mask='DD/MM/YYYY'
                inputFormat="DD/MM/YYYY"
                onChange={(e) => {
                  setFormValue({ ...formValue, birth_date: e !== null ? convertDate(e) : '' })
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <Button
            disabled={!formValue.name || !formValue.birth_date}
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

export default Clients
