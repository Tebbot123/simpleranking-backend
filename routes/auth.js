const express = require('express')
const router = express.Router()
const Captcha = require("hcaptcha")


router.post('/login', async (req, res) => {
    console.log("called")
    const body = req.body
    const token = body.token

    const result = await Captcha.verify(process.env.CAPTCHA, token)

    res.json(result)
    console.log(result)


})


module.exports = router
