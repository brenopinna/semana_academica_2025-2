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

# Criando nossa própria API

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

## Analisando os dados e criando mais rotas

Podemos identificar que os itens retornados seguem o seguinte padrão:

```json
"data": [
    ...,
    {
      "id": "...",
      "title": "...",
      "image": {
        "medium": "...",
        "large": "..."
      }
    },
    ...
]
```

Assim, podemos usar a **desestruturação** para obter dados sobre um único item, a partir de seu **id**. Com o express, isso é possível da seguinte forma:

```js
app.get("/comics/:id", async (req, res) => {
  try {
    const { id } = req.params // vai nos retornar os parâmetros da URL
    const response = await fetch(`http://localhost:3000/data/${id}`) // vai fazer uma requisicao especificamente a um elemento, se existir.
    const results = await response.json() // vai converter o corpo dessa resposta em json
    res.status(200).json(results)
  } catch (error) {
    res.status(400).json({
      error: "Nao foi possivel encontrar o item solicitado. Verifique o id fornecido.",
    })
  }
})
```

A passagem de `:id` na URL nos indica que esse campo não é um valor textual fixo, como `comics`, mas sim um **parâmetro**, que poderá assumir um valor diferente a cada requisição. Seu valor pode ser obtido a partir do atributo `req`, que se refere a um objeto que possui dados sobre a requisição realizada.

# Segurança e facilidade de manutenção: o arquivo `.env`

Repare que a URL do nosso banco de dados aparece em diversos lugares no nosso código. Imagine agora um sistema muito maior. Seria um grande trabalho mudar uma por uma caso nosso sistema mudasse o local da hospedagem, certo? Então, o que faz mais sentido é guardar esse valor em uma variável.

Entretanto, por questões de segurança, essas URLs sensíveis, como as que nos direcionam para o banco de dados ou algum outro local, não devem aparecer no código fonte, pois este pode ser acessado e isso gerar falhas de segurança. Assim, usamos os arquivos de **variáveis de ambiente**, ou seja, arquivos que não são compartilhados, cada ambiente de hospedagem vai ter o seu, e não será facilmente acessível por um usuário sem permissões.

Colocarei algumas variáveis que fazem sentido pertencer ao contexto do ambiente no nosso arquivo `.env`.

```
PORT = 8080
DATABASE_BASEURL = http://localhost:3000/data
```

Podemos acessá-las no nosso código através do objeto `process`, da seguinte maneira:

```js
process.env.NOME_DA_VARIAVEL
```

Entretanto, o Node não reconhece diretamente as variáveis de ambiente, e para isso precisamos do pacote `dotenv`, que será responsável por carregar os valores das variáveis do arquivo `.env` para o objeto `process.env` do Node!

```bash
npm i dotenv
```

```js
import dotenv from "dotenv"

dotenv.config({ quiet: true }) // a partir daqui, as variaveis de ambiente serao reconhecidas!
```

# Facilidade na execução: os scripts Node

Foram apresentados aqui diversos comandos para rodar os servidores que estamos desenvolvendo, mas... pode ser um pouco chato e até mesmo improdutivo ficar executando vários e vários comandos a cada vez que se necessitar iniciar o servidor. Uma alternativa para reduzir esse trabalho é a utilização dos **scripts Node**, que através do uso de mnemônicos, reduzem o trabalho de escrita para executar tarefas que se repetem várias vezes no processo do desenvolvimento.

No arquivo `package.json`, existe um campo `scripts`, que vai inicialmente apresentar somente um script de teste padrão. Você pode criar os seus próprios scripts lá dentro, sendo eles executáveis da seguinte forma:

```bash
npm run [NOME DO SCRIPT]
```

Assim, criarei os seguintes para facilitar a execução:

```json
"scripts": {
    "db:start": "npx json-server comics.json",
    "start": "node --watch main.js",
    "dev": "npm run db:start & npm run start"
  },
```

Eu posso tanto executar separadamente os scripts para iniciar o banco de dados e o servidor, ou usar a alternativa do operador `&` para rodar ambos paralelamente em um único comando. Como esse projeto possui um escopo pequeno e não precisaremos nos ater a detalhes de logs, utilizarei essa estratpegia por simplicidade, que estará no script `dev`.

# APIs utilizadas para obter os dados para povoar o banco de dados:

- [Comic Vine](https://comicvine.gamespot.com/api/documentation#toc-0-43)
- [MyAnimeList](https://myanimelist.net/clubs.php?cid=13727)
