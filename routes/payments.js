const express= require("express")
const router = express.Router()

const stripe = require("../Services/payments/Stripe")

async function createPaymentIntent(amount) {
    const paymentIntent = stripe.paymentIntents.create({
        amount: amount,
        currency: 'gbp'
    });
    return paymentIntent
}

router.get("/", (req, res) => {
    res.send("hello person!")
})


router.post('/createpayment', async (req, res) => {
    console.log("Hi")
    const {product} = req.body
    if (product === "lifetime") {
        const pi = await createPaymentIntent(7000)
        res.json(pi)
    }
})



module.exports = router