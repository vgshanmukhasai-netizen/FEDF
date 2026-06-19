
const express = require("express")
const dotEnv = require("dotenv")

const app = express()

const PORT = 5000

app.listen(PORT, () => {
    console.log(`Server Started and running at ${PORT}`)
})
