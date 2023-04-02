const express = require('express')
const router = express.Router()

const fetch = require("cross-fetch")
const axios = require("axios")

const funcaptcha = require("funcaptcha")

async function getLoginCsrf() {
    const raw = await fetch('https://auth.roblox.com/v2/login', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': ''
        }
    })
    return raw.headers.get('x-csrf-token')
}

async function getLoginFieldData(username, password) {

    const c = await getLoginCsrf()
    const headers = {
        'authority': 'auth.roblox.com',
        'x-csrf-token': c,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/536.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
        'content-type': 'application/json;charset=UTF-8',
        'accept': 'application/json, text/plain, */*'
    }
    const request = await axios.post('https://auth.roblox.com/v2/login', {
        ctype: 'Username',
        cvalue: username,
        password: password

    }, {
        headers: headers,
    }).catch(e => e.response)


    if (request.status === 429) {
        throw 'ratelimoted'

    }
    const json = JSON.parse(request.data.errors[0]['fieldData'])
    return json
}

router.post('/createCaptcha', async (req, res) => {
    const body = req.body

    const username = body.username
    const password = body.password

    console.log(body)

    const fieldData = await getLoginFieldData(username, password)


    const token = await funcaptcha.getToken({
        pkey: "476068BF-9607-4799-B53D-966BE98E2B81", // The public key
        surl: "https://roblox-api.arkoselabs.com", // OPTIONAL: Some websites can have a custom service URL
        data: { // OPTIONAL
            blob: fieldData["dxBlob"] // Some websites can have custom data passed: here it is data[blob]
        },
        headers: { // OPTIONAL
            // You can pass custom headers if you have to, but keep
            // in mind to pass a user agent when doing that
            "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
        },
        site: "https://www.roblox.com", // OPTIONAL: The site parameter, usually not required
        // NOTE: The proxy will only be used for fetching the token, and not future requests such as getting images and answering captchas
    })

    console.log(token)

    let session = new funcaptcha.Session(token)

    const json = {
        url: session.getEmbedUrl(),
        captchaId: fieldData.unifiedCaptchaId,
        token: token.token
    }

    res.json(json)


})
router.post("/login", async (req, res) => {
    // TODO username + password
    const body = req.body

    // Username + Password

    const username = body.username
    const password = body.password

    // Captcha

    const captchaToken = body.token
    const captchaId = body.captchaId

    const c = await getLoginCsrf()
    const headers = {
        'authority': 'auth.roblox.com',
        'x-csrf-token': c,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/536.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
        'content-type': 'application/json;charset=UTF-8',
        'accept': 'application/json, text/plain, */*'
    }
    const request = await axios.post('https://auth.roblox.com/v2/login', {
        ctype: 'Username',
        cvalue: username,
        password: password,
        captchaId: captchaId,
        captchaToken: captchaToken,

    }, {
        headers: headers,
    }).catch(e => e.response)


    if (request.status === 429) {
        throw 'ratelimoted'

    } else if(request.status === 400) {
        res.json({
            message: 'Invalid Username + Password'
        })
        return
    }
    let cookie

    request.headers['set-cookie'].find(v => {
        const cookiea = v.split("=")
        if (cookiea[0] === ".ROBLOSECURITY") {
            cookie = cookiea[1].split(";")[0]
        }
    })




    res.json({
        message: 'Successfully made bot!',
        cookie: cookie
    })

})

module.exports = router
