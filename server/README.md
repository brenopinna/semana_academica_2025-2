# 📚 Sumário <!-- omit from toc -->

- [⭐ Projeto Comics API](#-projeto-comics-api)
- [🛠️ Iniciando a configuração do ambiente](#️-iniciando-a-configuração-do-ambiente)
  - [Criando o projeto e instalando dependências](#criando-o-projeto-e-instalando-dependências)
  - [Preparando o banco de dados](#preparando-o-banco-de-dados)
  - [Rodando o json-server](#rodando-o-json-server)
- [🌐 Criando nossa própria API](#-criando-nossa-própria-api)
  - [Criando o servidor com Express](#criando-o-servidor-com-express)
  - [Criando a primeira rota](#criando-a-primeira-rota)
    - [Middleware?](#middleware)
  - [Analisando os dados e criando mais rotas](#analisando-os-dados-e-criando-mais-rotas)
- [🏗️ Profissionalizando o ambiente de desenvolvimento](#️-profissionalizando-o-ambiente-de-desenvolvimento)
  - [Segurança e facilidade de manutenção: o arquivo `.env`](#segurança-e-facilidade-de-manutenção-o-arquivo-env)
  - [Facilidade na execução de comandos: os scripts Node](#facilidade-na-execução-de-comandos-os-scripts-node)
    - [Pacote `concurrently`](#pacote-concurrently)
- [🎁 Extra](#-extra)
  - [Rodando o projeto localmente](#rodando-o-projeto-localmente)
    - [Instalação](#instalação)
    - [Execução](#execução)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Estrutura de Arquivos do Projeto](#estrutura-de-arquivos-do-projeto)
  - [APIs utilizadas para obter os dados para povoar o banco de dados:](#apis-utilizadas-para-obter-os-dados-para-povoar-o-banco-de-dados)

---

# ⭐ Projeto Comics API

API simples para estudos de rotas, variáveis de ambiente, scripts Node e ExpressJS.  
O sistema retorna dados de quadrinhos e permite o acesso individual por **ID**.

# 🛠️ Iniciando a configuração do ambiente

Primeiro, é necessário que você tenha o Node.js instalado na sua máquina.

O Node.js é um **ambiente de execução do JavaScript fora do navegador**. Com ele, conseguimos rodar aplicações diretamente no computador.
Junto com o Node, será instalado também o **npm** (Node Package Manager), que facilita o gerenciamento de pacotes e bibliotecas.

---

## Criando o projeto e instalando dependências

1. Inicie um projeto Node com configurações padrão:

   ```bash
   npm init -y
   ```

2. Instale o `json-server`, que vamos usar para simular nosso banco de dados:

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

```bash
JSON Server started on PORT :3000
Press CTRL-C to stop
Watching comics.json...

♡⸜(˶˃ ᵕ ˂˶)⸝♡

Index:
http://localhost:3000/

Static files:
Serving ./public directory if it exists

Endpoints:
http://localhost:3000/data
```

> Exemplo de output no terminal após iniciar o `json-server`

---

# 🌐 Criando nossa própria API

Não é interessante deixar os dados do banco totalmente abertos ao usuário. Por isso, vamos criar **nossa própria API**, que funcionará como intermediária entre o banco e a aplicação, mas com **controle e regras definidos por nós**.

A melhor (e mais clássica) analogia para uma API é a do garçom. Imagine que você (usuário) está em um restaurante, e deseja algo da cozinha (um banco de dados, no nosso exemplo). Você não é permitido a entrar lá, pois os funcionários da cozinha tem suas próprias atribuições e procedimentos, e sua presença seria certamente um problema.

Assim, surge o **garçom** (API), para estabelecer, dentro de algumas regras, a conexão entre você e a cozinha, levando os pedidos (requisições) de você para a cozinha e trazendo os pratos (resultados) da cozinha.

Repare que em nenhum momento você entrou diretamente na cozinha, e nem sabe como funcionam os procedimentos internos desse ambiente. Assim, a API serve também para estabelecer maior **\*segurança e privacidade** na interação entre sistemas distintos.

Para isso, usaremos o `ExpressJS`, um framework simples para criar APIs.

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

### Middleware?

O middleware (_software do meio_, em tradução livre) se refere, de forma simplificada, a algum programa que é executado no meio de outros programas. No exemplo acima, temos um middleware que se "intromete" entre o usuário e o servidor, para converter as requisições e respostas para o formato JSON.

Middlewares são presentes em diversos contextos na computação, então procure se familiarizar com esse conceito!

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

# 🏗️ Profissionalizando o ambiente de desenvolvimento

## Segurança e facilidade de manutenção: o arquivo `.env`

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

## Facilidade na execução de comandos: os scripts Node

Foram apresentados aqui diversos comandos para rodar os servidores que estamos desenvolvendo, mas... pode ser um pouco chato e até mesmo improdutivo ficar executando vários e vários comandos a cada vez que se necessitar iniciar o servidor. Uma alternativa para reduzir esse trabalho é a utilização dos **scripts Node**, que através do uso de mnemônicos, reduzem o trabalho de escrita para executar tarefas que se repetem várias vezes no processo do desenvolvimento.

No arquivo `package.json`, existe um campo `scripts`, que vai inicialmente apresentar somente um script de teste padrão. Você pode criar os seus próprios scripts lá dentro, sendo eles executáveis da seguinte forma:

```bash
npm run [NOME DO SCRIPT]
```

Assim, criarei os seguintes para facilitar a execução:

```json
"scripts": {
    "db:start": "npx json-server comics.json",
    "server": "node --watch main.js"
  },
```

### Pacote `concurrently`

Eu posso executar em terminais separados os scripts para iniciar o banco de dados e o servidor, o que não seria um problema. Mas para fins de curiosidade, utilizarei o pacote `concurrently` para vermos como executar esses scripts paralelamente e, mais importante, com suporte a **múltiplas plataformas** (Windows, Linux, WSL, macOS, etc.).

```bash
npm i concurrently
```

Agora modificarei os scripts para utilizar esse pacote:

```json
"scripts": {
    "db:start": "npx json-server comics.json",
    "server": "node --watch main.js",
    "start": "concurrently \"npm run server\" \"npm run db:start\""
  },
```

Com isso, o comando `npm run start` faz os dois comandos serem executados na mesma hora, além de diferenciar os logs, simplificando nosso trabalho.

Cabe ressaltar que, em um ambiente de desenvolvimento real, o banco de dados e o seu servidor estariam rodando em locais totalmente diferentes, o que não tornaria útil o uso desse pacote.

# 🎁 Extra

## Rodando o projeto localmente

### Instalação

```bash
git clone git@github.com:brenopinna/semana_academica_2025-2.git
cd server
npm i;
```

### Execução

```bash
npm run dev
```

ou

```bash
npm run db:start
npm run start
```

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/en/download)
- [ExpressJS](https://expressjs.com/)
- [JSON Server](https://github.com/typicode/json-server)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Concurrently](https://www.npmjs.com/package/concurrently)

## Estrutura de Arquivos do Projeto

```
server/
┣ main.js
┣ comics.json
┣ README.md
┣ package.json
┣ package-lock.json
┗ .env
```

## APIs utilizadas para obter os dados para povoar o banco de dados:

- [Comic Vine](https://comicvine.gamespot.com/api/documentation#toc-0-43)
- [MyAnimeList](https://myanimelist.net/clubs.php?cid=13727)
