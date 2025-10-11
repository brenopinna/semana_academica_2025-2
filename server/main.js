import express from "express"
import dotenv from "dotenv"

dotenv.config({ quiet: true }) // a partir daqui, as variaveis de ambiente serao reconhecidas!

const app = express()

app.use(express.json())

app.get("/comics", async (_, res) => {
  console.log(process.env.DATABASE_BASEURL)
  try {
    const response = await fetch(process.env.DATABASE_BASEURL) // vai fazer uma requisicao ao servidor
    const results = await response.json() // vai converter o corpo dessa resposta em json
    res.status(200).json(results)
  } catch (error) {
    res.status(400).json({
      error: "Nao foi possivel conectar-se ao banco de dados. Aguarde e tente novamente.",
    })
  }
})

app.get("/comics/:id", async (req, res) => {
  try {
    const { id } = req.params // vai nos retornar os parâmetros da URL
    const response = await fetch(`${process.env.DATABASE_BASEURL}/${id}`) // vai fazer uma requisicao especificamente a um elemento, se existir.
    const results = await response.json() // vai converter o corpo dessa resposta em json
    res.status(200).json(results)
  } catch (error) {
    res.status(400).json({
      error: "Nao foi possivel encontrar o item solicitado. Verifique o id fornecido.",
    })
  }
})

app.listen(process.env.PORT, () => {
  console.log("Rodando!🚀")
})
