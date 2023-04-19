const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));

const stripe = require('stripe')(
  'sk_test_51Mm0ayBw1bJVX0T910x1qyHrEq5TtfyTPfPa3sLv1W8vpNvzudyizPy50mCnjVel89gtWzHWQx46zSd7ErEeoDvO00IHDJIZCG'
);

app.post('/checkout', async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.product],
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: ' http:localhost4200/success.html',
      cancel_url: ' http:localhost4200/cancel.html',
    });
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
});

app.listen(4200, () => console.log('app is running on 4200'));
