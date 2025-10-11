# Para quem já tiver os arquivos prontos e quiser apenas executar para testar

1. `npm i`
2. `npx json-server [NOME DO ARQUIVO].json`
3. `node --watch [NOME DO ARQUIVO].js`

# Iniciando a configuração do ambiente

Primeiro, é necessário que você tenha o [Node.js](https://nodejs.org/en/download) instalado na sua máquina.

O Node.js é um **ambiente de execução do JavaScript fora do navegador**. Com ele, conseguimos rodar aplicações diretamente no computador.
Junto com o Node, será instalado também o **npm** (Node Package Manager), que facilita o gerenciamento de pacotes e bibliotecas.

---

## Criando o projeto e instalando dependências

1. Inicie um projeto Node com configurações padrão:

   ```bash
   npm init -y
   ```

2. Instale o [`json-server`](https://github.com/typicode/json-server), que vamos usar para simular nosso banco de dados:

   ```bash
   npm i json-server
   ```

   Ao instalar:

   - será criada a pasta `node_modules`, onde ficam todos os arquivos necessários para as bibliotecas funcionarem;
   - será criado o arquivo `package-lock.json`, que contém informações sobre as dependências. Esse arquivo é gerado automaticamente, então **não precisa editá-lo**.

---

## Preparando o banco de dados

Para testar nosso banco, precisamos preenchê-lo com alguns dados. Para isso, usamos algumas APIs para conseguir esses dados e as colocamos no fim desse README para que posteriormente você possa acessá-las também. Não iremos realizar o consumo de cada uma por conta do tempo, mas leia as documentações delas para mais detalhes.

Mas antes, precisamos falar do formato de arquivos **JSON**.

JSON significa **JavaScript Object Notation**. Apesar do nome, ele não é exclusivo do JavaScript: é um formato **universal**, usado para transferir dados na web em praticamente todas as linguagens.

Regras do JSON:

- chaves **sempre com aspas duplas**;
- strings **sempre entre aspas duplas**;
- não é possível rodar código dentro de arquivos JSON.

---

## Rodando o json-server

Com o arquivo JSON pronto, rode o comando:

```bash
npx json-server [NOME_DO_ARQUIVO].json
```

> O `npx` significa **npm execute**. Ou seja, estamos dizendo: “npm, execute essa biblioteca aqui pra mim”.

Após rodar, no terminal aparecerão os **endpoints** disponíveis.
Esses endpoints fazem parte da **API** do `json-server`.

Pense na API como um garçom:

- você (cliente) não entra na cozinha (servidor/banco de dados);
- o garçom (API) leva seu pedido e traz a resposta pronta.

➡️ Experimente acessar a URL de um endpoint do `json-server` no navegador para ver os dados retornados.

\[INCLUIR PRINT QUANDO A BASE ESTIVER PRONTA]

---

## Criando nossa própria API

Não é interessante deixar os dados do banco totalmente abertos ao usuário. Por isso, vamos criar **nossa própria API**, que funcionará como intermediária entre o banco e a aplicação, mas com **controle e regras definidos por nós**.

Para isso, usaremos o [`ExpressJS`](https://expressjs.com/), um framework simples para criar APIs.

Instale o Express:

```bash
npm i express
```

---

## Criando o servidor com Express

Crie um arquivo `.js` (ex.: `server.js`) e adicione:

```js
import express from "express"

const app = express()
const port = 8080

app.listen(port, () => {
  console.log("Rodando! 🚀")
})
```

Antes de rodar, precisamos ajustar o `package.json` adicionando:

```json
{
  ...
  "type": "module",
  ...
}
```

Agora execute:

```bash
node --watch server.js
```

> A flag `--watch` reinicia automaticamente o servidor sempre que o arquivo for alterado.

---

## Criando a primeira rota

Vamos adicionar uma rota `GET` para buscar dados do nosso banco fake:

> Quando inserimos uma URL num navegador, a requisição que ocorre por padrão é a GET, então para acessar os resultados dessa rota, basta colarmos a endpoint no navegador e observar o que é retornado!

```js
app.use(express.json()) // middleware para trabalhar com JSON nas requisições/respostas

app.get("/comics", async (_, res) => {
  try {
    const response = await fetch("http://localhost:3000/data") // requisita dados do json-server
    const results = await response.json() // converte a resposta para JSON
    res.status(200).json(results)
  } catch (error) {
    res.status(400).json({
      error: "Não foi possível conectar-se ao banco de dados. Aguarde e tente novamente.",
    })
  }
})
```

Com isso, temos a primeira versão da nossa API!

# APIs utilizadas para obter os dados para povoar o banco de dados:

- [Comic Vine](https://comicvine.gamespot.com/api/documentation#toc-0-43)
- [MyAnimeList](https://myanimelist.net/clubs.php?cid=13727)
