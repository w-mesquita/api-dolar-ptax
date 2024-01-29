const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.get('/cotacao-dolar', async (req, res) => {
  try {
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    const dataHoje = hoje.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    const dataOntem = ontem.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    const response = await axios.get(
      `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${dataOntem}'&@dataFinalCotacao='${dataHoje}'&$top=1&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`
    );

    const data = response.data.value[0];

    res.status(200).json([{
      cotacaoCompra: data.cotacaoCompra,
      cotacaoVenda: data.cotacaoVenda,
      dataHoraCotacao: data.dataHoraCotacao,
    }]);
  } catch (error) {
    console.error('Erro ao obter a cotação do dólar PTAX:', error.message);
    res.status(500).json({ error: 'Erro ao obter a cotação do dólar PTAX' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});