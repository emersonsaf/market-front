import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import BodyDataGrid from '../components/BodyDataGrid'
import { PurchasePerMonthInterface, getAllPurchasePerMonth } from './api/purchase';
import { FormControl, MenuItem, Select } from '@mui/material';
import { formatCurrency } from '../util/formatMoney';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientInterface {
  total_spent: number,
  user_name: string,
  month: string
}

const Home: NextPage = () => {

  const [valuesPerMonths, setValuesPerMonths] = useState<ClientInterface[]>([]);
  const [arrMonths, setArrMonths] = useState<string[]>([]);
  const [client, setClient] = useState<ClientInterface>();
  const [] = useState(null);

  useEffect(() => {
    loadData();
  }, [])

  async function loadData() {
    const listPerMonth: any = await getAllPurchasePerMonth();
    let arrMonths: string[] = [];

    listPerMonth.data.map((period: PurchasePerMonthInterface) => {
      arrMonths.push(period.month);
    });

    setArrMonths(arrMonths);
    setValuesPerMonths(listPerMonth.data);
  }

  async function handleSelectperiod(period: any) {
    const values = valuesPerMonths.filter((item, index) => index === period)[0];
    setClient(values);
  }

  function formatPeriod(dateString: string) {
    const date = new Date(dateString + '-01');
    const formattedString = format(date, 'MMMM \'de\' yyyy', { locale: ptBR });
    return formattedString
  }

  return (
    <main className='container'>
      <h1 style={{color: 'black'}}> Listagem de comprador por mês </h1>
      <div style={{ color: 'black', marginTop: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>

        <Select
          style={{ width: '200px', marginTop: '1rem' }}
          label="Mês"
          onChange={(period) => handleSelectperiod(period.target.value)}
        >
          {
            arrMonths.map((month: string, key) => (<MenuItem value={key}>{formatPeriod(month)}</MenuItem>))
          }
        </Select>

        {
          client?.user_name && (
            <section>
              <h3>Comprador do mês! </h3>
              <p>O cliente que mais comprou no período de <b>{formatPeriod(client.month)}</b> foi - <b>{client.user_name}</b>! </p>
              <p>Gastando um total de <b>{formatCurrency(client.total_spent)}</b> !</p>
            </section>
          )
        }
      </div>
    </main>
  )
}

export default Home