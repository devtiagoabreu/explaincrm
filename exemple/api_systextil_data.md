---

# API Systextil Data

Documentação das APIs utilizadas para integração com dados comerciais, pedidos e representantes.

---

# Credenciais de Acesso
CLIENT_ID:'vM_z3JIQSR7fMml912X4Wg..'
CLIENT_SECRET:'v6CnE7I6vI6JkYn7DOIQ6A..'
ACCESS_TOKEN_URL:'https://promoda.systextil.com.br/apexbd/erp/oauth/token'

API_URL_CLIENTES_ATIVOS:'https://promoda.systextil.com.br/apexbd/erp/systextil-intg-plm/api_comercial_clientes_ativos'
API_URL_PEDIDOS:'https://promoda.systextil.com.br/apexbd/erp/systextil-intg-plm/api_vendas_por_produto'
API_URL_REPRESENTANTES:'https://promoda.systextil.com.br/apexbd/erp/systextil-intg-plm/api_listagem_representantes'

# 1. api_comercial_clientes_ativos

Retorna a listagem de clientes ativos com informações cadastrais, comerciais e financeiras.

## Endpoint

```
api_comercial_clientes_ativos
```

## Descrição

Consulta clientes que realizaram compras nos últimos 48 meses.

## Query SQL

```sql
SELECT
  C.COD_CLIENTE,
  C.NOME_CLIENTE,
  C.FANTASIA_CLIENTE,
  C.CGC_9,
  C.CGC_4,
  C.CGC_2,
  C.INSC_EST_CLIENTE,
  C.ENDERECO_CLIENTE,
  C.BAIRRO,
  C.COD_CIDADE,
  C.CEP_CLIENTE,
  C.TELEFONE_CLIENTE,
  C.CELULAR_CLIENTE,
  C.E_MAIL,
  C.SITUACAO_CLIENTE,
  C.DATA_CAD_CLIENTE,
  C.DATA_ATUALIZACAO,
  C.CDREPRES_CLIENTE,
  R.COD_REP_CLIENTE,
  R.NOME_REP_CLIENTE AS NOME_REPRESENTANTE,
  C.SUB_REGIAO,
  C.SEGMENTO_MERCADO,
  C.COD_SIT_CREDITO,
  C.VAL_LIM_CREDITO,
  C.MAIOR_TITULO,
  C.ATRASO_MEDIO,
  C.DATA_ULT_COMPRA,
  C.VALOR_ULT_COMPRA,
  C.ACUMULADO_VENDAS
FROM PEDI_010 C
LEFT JOIN PEDI_020 R
       ON R.COD_REP_CLIENTE = C.CDREPRES_CLIENTE
WHERE C.DATA_ULT_COMPRA BETWEEN ADD_MONTHS(TRUNC(SYSDATE), -48) AND SYSDATE
```

## Exemplo de resposta

```json
{
  "items": [
    {
      "COD_CLIENTE": 0,
      "NOME_CLIENTE": "AP DE OLIVEIRA COMERCIO DE MOVEIS LTDA",
      "FANTASIA_CLIENTE": "AP DE OLIVEIRA COM - PREMIUM ESTOFADOS",
      "CNPJ": "34234215/0001-99",
      "ENDERECO_CLIENTE": "AV FERES CURY",
      "BAIRRO": "PARQUE INDUSTRIAL II",
      "CIDADE": 9927,
      "TELEFONE_CLIENTE": 34214389,
      "NOME_REPRESENTANTE": "RODRIGO GONÇALVES CONSTANTINO REPR. ME",
      "DATA_ULT_COMPRA": "2025-03-18T00:00:00Z",
      "VALOR_ULT_COMPRA": 551.4,
      "ACUMULADO_VENDAS": 2415
    }
  ]
}
```

---

# 2. api_vendas_por_produto

Retorna pedidos e vendas detalhadas por produto.

## Endpoint

```
api_vendas_por_produto
```

## Descrição

Consulta pedidos com previsão de entrega entre o mês anterior e os próximos 2 meses.

## Query SQL

```sql
SELECT
    PEDIDO,
    SITUACAO,
    DECODE(NUMERO_INTERNO,1,'FINANCEIRO',2,'PCP',3,'SEPARACAO',4,'FATURAMENTO',8,'ENVIADO','COMERCIAL') AS POSICAO,
    NUMERO_INTERNO,
    EMISSAO,
    ENTREGA,
    PERIODO,
    UF,
    CNPJ,
    NOME_CLIENTE,
    FANTASIA,
    NOME_REPRESENANTE,
    NOME_REGIAO,
    CIDADE,
    CONDICAO_PGTO,
    LINHA,
    GRUPO,
    SUB,
    COR,
    PRODUTO,
    NOME_GRUPO,
    NOME_SUB,
    NOME_COR,
    NARRATIVA,
    VENDIDO,
    FATURADO,
    SALDO,
    UNITARIO,
    SALDO * UNITARIO AS VALOR_VENDIDO
FROM pmdvw_vendas
WHERE ENTREGA BETWEEN TRUNC(ADD_MONTHS(SYSDATE, -1), 'MM')
AND LAST_DAY(ADD_MONTHS(SYSDATE, 2))
```

## Exemplo de resposta

```json
{
  "items": [
    {
      "PEDIDO": 6595,
      "SITUACAO": "10-Faturado",
      "POSICAO": "PCP",
      "EMISSAO": "2025-09-16T00:00:00Z",
      "ENTREGA": "2026-02-03T00:00:00Z",
      "UF": "SP",
      "CLIENTE": "HELLEN COLCHOES",
      "PRODUTO": "2.21114.CRU.000013",
      "DESCRICAO": "TECIDO RUSTICO PROVENCA CRU CINZA",
      "VENDIDO": 2000,
      "UNITARIO": 9.22,
      "VALOR_VENDIDO": 0
    }
  ]
}
```

---

# 3. api_listagem_representantes

Retorna cadastro completo dos representantes comerciais.

## Endpoint

```
api_listagem_representantes
```

## Descrição

Lista representantes com dados cadastrais, comissão e contato.

## Query SQL

```sql
SELECT 
    SIT_REP_CLIENTE,
    COD_EMPRESA,
    NOME_REP_CLIENTE,
    FANTASIA_REPRES,
    E_MAIL,
    NUMERO_CELULAR,
    COD_REP_CLIENTE,
    COD_CIDADE,
    PERC_COMIS_FATU,
    TIPO_REPR
FROM PEDI_020
```

## Exemplo de resposta

```json
{
  "items": [
    {
      "COD_REP_CLIENTE": 179,
      "NOME_REP_CLIENTE": "LEILA DOMINGUES",
      "FANTASIA_REPRES": "LEMAR REPRESENTAÇÕES",
      "EMAIL": "leiladomingues@hotmail.com",
      "CELULAR": 982407385,
      "COMISSAO": 0
    }
  ]
}
```

---

# Padrão de resposta da API

Todas as APIs retornam:

```json
{
  "items": []
}
```

---

# Observações

* Datas estão no padrão ISO 8601
* Valores monetários em formato decimal
* Campos podem variar conforme permissões do banco
* Atualização conforme dados do ERP Systextil

---

# Exemplo de api implantada no apps Script
function api_financeiro_contas_a_receber() {
  const clientId = 'vM_z3JIQSR7fMml912X4Wg..';
  const clientSecret = 'v6CnE7I6vI6JkYn7DOIQ6A..';
  const tokenUrl = 'https://promoda.systextil.com.br/apexbd/erp/oauth/token';
  const apiUrl = 'https://promoda.systextil.com.br/apexbd/erp/systextil-intg-plm/api_financeiro_contas_a_receber';

  try {
    // 🔑 Obter token
    const tokenOptions = {
      method: 'post',
      payload: { grant_type: 'client_credentials' },
      headers: {
        'Authorization': 'Basic ' + Utilities.base64Encode(clientId + ':' + clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      muteHttpExceptions: true
    };

    const tokenResponse = UrlFetchApp.fetch(tokenUrl, tokenOptions);
    const tokenData = JSON.parse(tokenResponse.getContentText());

    if (!tokenData.access_token) {
      throw new Error("Erro ao obter token: " + tokenResponse.getContentText());
    }

    const accessToken = tokenData.access_token;

    // 📡 Chamar API
    const apiOptions = {
      method: 'get',
      headers: { 
        'Authorization': 'Bearer ' + accessToken,
        'Accept': 'application/json'
      },
      muteHttpExceptions: true
    };

    const apiResponse = UrlFetchApp.fetch(apiUrl, apiOptions);
    const dataText = apiResponse.getContentText();
    Logger.log(dataText); // 📌 log para garantir que está chegando JSON
    const data = JSON.parse(dataText);

    // 📊 Escrever na planilha
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("api_financeiro_contas_a_receber");

    // Limpar dados antigos
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
    }

    if (data.items && data.items.length > 0) {
      const values = data.items.map(item => [
        item.num_duplicata,
        item.parcela,
        item.tipo_titulo,
        item.pd,
        item.pf,
        item.situacao_duplic,
        item.emissao,
        item.venc_original,
        item.vencimento,
        item.cod_cliente,
        item.cliente,
        item.pedido_venda,
        item.representante,
        item.perc_comissao,
        item.valor_comissao,
        item.portador,
        item.numero_remessa,
        item.nr_titulo_banco,
        item.conta_corrente,
        item.cod_carteira,
        item.transacao,
        item.perc_desconto,
        item.nr_solicitacao,
        item.valor_duplicata,
        item.saldo_duplicata,
        item.prorrogacao,
        item.posicao,
        item.situacao_duplicata,
        item.historico,
        item.codigo_contabil,
        item.num_contabil,
        item.forma_pagto,
        item.duplic_impressa,
        item.previsao,
        item.numero_titulo,
        item.nota_fiscal,
        item.email_cliente
      ]);

      sheet.getRange(2, 1, values.length, values[0].length).setValues(values);
    } else {
      Logger.log("⚠ Nenhum registro retornado pela API.");
    }

  } catch (e) {
    Logger.log("❌ Erro: " + e.message);
  }
}
