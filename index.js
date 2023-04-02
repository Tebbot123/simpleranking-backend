const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()

app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}))

require("dotenv").config()

/* Routes */

app.use('/api/payments/', require("./routes/payments"))
app.use('/api/captcha', require("./routes/captcha"))
app.use('/api/auth', require("./routes/auth"))

app.get("/", (req, res) => {
    res.send("You found me!")
})



/* api docs */
/*const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require("swagger-jsdoc")

var settings = {
    explorer: true,
};

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Simpleranking",
            version: "0.0.1",
            description:
                "API documentation for our website endpoints and our ranking endpoints (you need to have keys/logged in)",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Simpleranking",
                url: "lol",
                email: "add@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:8080/api/ranking",
            },
            {
                url: "http://localhost:8080/api/webbie",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, settings)); */



app.listen(8082, () => {
    console.log("server running on port 8082")
})
