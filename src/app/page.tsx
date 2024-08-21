'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExchangeData {
  market: string;
  price: number;
  volume24hour: number;
}

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Exchanges = () => {
  const [exchangeData, setExchangeData] = useState<ExchangeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeData = async () => {
      try {
        const response = await axios.get('https://min-api.cryptocompare.com/data/top/exchanges/full', {
          params: {
            fsym: 'BTC',  // Substitua por qualquer criptomoeda de sua escolha
            tsym: 'USD',  // Substitua por qualquer moeda fiduciária de sua escolha
          },
          headers: {
            'authorization': `Apikey ${API_KEY}`
          }
        });

        const exchanges = response.data.Data.Exchanges.slice(0, 3).map((exchange: any) => ({
          market: exchange.MARKET,
          price: exchange.PRICE,
          volume24hour: exchange.VOLUME24HOUR,
        }));

        setExchangeData(exchanges);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao obter os dados das exchanges:', error);
        setLoading(false);
      }
    };

    fetchExchangeData();
  }, []);

  const data = {
    labels: exchangeData.map((exchange) => exchange.market),
    datasets: [
      {
        label: 'Volume de Negociação (24h)',
        data: exchangeData.map((exchange) => exchange.volume24hour),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Volume de Negociação por Exchange',
      },
    },
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>CORRETORA DUFF - Volumes de Negociação em Exchanges</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <Bar data={data} options={options} />
          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', backgroundColor: '#f9f9f9' }}>
            <thead>
              <tr style={{ backgroundColor: '#333', color: '#ffffff' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Exchange</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Preço (USD)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Volume 24h</th>
              </tr>
            </thead>
            <tbody>
              {exchangeData.map((exchange, index) => (
                <tr key={index}>
                  <td style={{color:'#000', border: '1px solid #ddd', padding: '8px' }}>{exchange.market}</td>
                  <td style={{color:'#000', border: '1px solid #ddd', padding: '8px' }}>{exchange.price.toFixed(2)}</td>
                  <td style={{color:'#000', border: '1px solid #ddd', padding: '8px' }}>{exchange.volume24hour.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Exchanges;
