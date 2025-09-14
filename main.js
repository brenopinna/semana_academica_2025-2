import express from "express"

const app = express()
const port = 8080

app.use(express.json())

app.get("/comics", async (_, res) => {
  try {
    const response = await fetch("http://localhost:3000/results") // vai fazer uma requisicao ao servidor
    const results = await response.json() // vai converter o corpo dessa resposta em json
    res.status(200).json(results)
  } catch (error) {
    res.status(400).json({
      error: "Nao foi possivel conectar-se ao banco de dados. Aguarde e tente novamente.",
    })
  }
})

app.listen(port, () => {
  console.log("Rodando!🚀")
})
