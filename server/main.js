import express from "express"
import dotenv from "dotenv"
import { readFileSync } from "node:fs"
import cors from "cors"

dotenv.config({ quiet: true }) // a partir daqui, as variaveis de ambiente serao reconhecidas!

const app = express()

app.use(cors({ origin: "*" })) // permite acesso de todas as urls

app.use(express.json())

app.get("/comics", async (_, res) => {
  try {
    const results = JSON.parse(readFileSync("./comics.json").toString())
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
    const results = JSON.parse(readFileSync("./comics.json").toString()).data.filter(
      (el) => el.id === id,
    )
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
