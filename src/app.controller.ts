import { Controller, Get } from '@nestjs/common';
import axios from 'axios';

@Controller()
export class AppController {
  @Get('/dolar-ptax')
  async getDolarPtax(): Promise<any> {
    try {
      // Obter a data de hoje
      const hoje = new Date();

      // Obter a data de ontem
      const ontem = new Date();
      ontem.setDate(hoje.getDate() - 1);

      // Formatando as datas para o formato 'MM-DD-YYYY'
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

      // Fazer uma requisição para o serviço de consulta do Banco Central
      const response = await axios.get(
        `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${dataOntem}'&@dataFinalCotacao='${dataHoje}'&$top=1&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`,
      );

      // Processar os dados da resposta conforme necessário
      const data = response.data.value;

      // Retornar os dados em formato JSON
      return data;
    } catch (error) {
      // Lidar com erros de maneira apropriada
      console.error('Erro ao obter a cotação do dólar PTAX:', error.message);
      throw new Error('Erro ao obter a cotação do dólar PTAX');
    }
  }
}
