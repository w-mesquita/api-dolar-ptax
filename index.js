const axios = require('axios');

exports.handler = async (event, context) => {
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

    return {
      statusCode: 200,
      body: JSON.stringify([{
        cotacaoCompra: data.cotacaoCompra,
        cotacaoVenda: data.cotacaoVenda,
        dataHoraCotacao: data.dataHoraCotacao,
      }]),
    };
  } catch (error) {
    console.error('Erro ao obter a cotação do dólar PTAX:', error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao obter a cotação do dólar PTAX' }),
    };
  }
};
