const cors = require("cors"); 
const express = require("express"); 
const paymentController = require("./Payment");
require("dotenv").config();

 
const stripe = require("stripe")("sk_test_51MiiQ7SC6PHGNS1oDOHhMeZy4AepUaDwx7vPsCsCC76BKkF5sZJmC8M8fRf5PNp5Nq2zybi1WcrAJNWuNrMe7gSq00kWutXl6B"); 
 
const app = express(); 
 
// Middlewares here 
app.use(express.json()); 
app.use(cors()); 
 
// Routes here 
app.get("/", (req, res) => { 
  res.send("Hello World"); 
}); 


app.post("/api/create-checkout-session", async (req, res) => { 
  console.log(req.body.product);
  console.log(req.body.product.name  );
    const products  = {
      
      name: req.body.product.name,
      price: req.body.product.price,
      quantity: req.body.product.quantity,
    }; 
    console.log(products);

    const session = await stripe.checkout.sessions.create({ 
      payment_method_types: ["card"], 
      line_items: [ 
        { 
          price_data: { 
            currency: "inr", 
            product_data: { 
              name: products.name, 
            }, 
            unit_amount: products.price * 100, 
          }, 
          quantity: products.quantity, 
        }, 
      ], 
      mode: "payment", 
      success_url: "http://localhost:3001/success", 
      cancel_url: "http://localhost:3001/cancel", 
    }); 
    res.json({ id: session.id }); 
  }); 
 //payment.js
app.post("/api/mandate",paymentController.setupIntent);
// Listen 
app.listen(8000, () => { 
  console.log("Server started at port 8000"); 
}); 