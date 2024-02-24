import express, { Request, Response } from "express";
import DefaultController from "./controllers/DefaultController";
const routes = express.Router();
routes.get("/", DefaultController.DefaultRoute);
const mercadopago = require("mercadopago");
import { CreateToken } from "./controllers/CreateToken";

// Rotas para o usuário
/*
routes.post("/usuarios/create", UserController.createUser);
routes.put("/usuarios/update", UserController.updateUser);
routes.delete("/usuarios/delete/:id", UserController.deleteUser);
routes.post("/req/login", UserController.login);
routes.get("/auth/:id", UserController.authLogin);
routes.get("/show/:id", UserController.showUser);
routes.post("/forgot-password", UserController.forgotPassword);
routes.get("/reset-password/:id/:code", UserController.resetPassword);
*/
export default routes;

routes.get("/consultaCliente", async (req: Request, res: Response) => {
  try {
    const existingCustomer = await mercadopago.customers.search({
      email: req.body.cardholderEmail,
    });
    let costumer;

    if (existingCustomer.body.results.length > 0) {
      costumer = existingCustomer.body.results[0];

      res.status(200).json({ costumer });
    } else {
      res.status(404).json({ message: "Cliente não encontrado" });
    }
  } catch (err) {
    res.status(400).json({ error: "Erro ao encontrar cliente" });
  }
});

routes.get("/consultaTransacao/:id", async (req: Request, res: Response) => {
  try {
    const paymentId = req.params.id;

    mercadopago.payment.capture(
      paymentId,
      mercadopago,
      (err: any, response: any) => {
        if (err) {
          res.status(404).json({ message: "Transação não encontrada:", err });
        } else {
          res.status(200).json({ response });
        }
      }
    );
  } catch (err) {
    res.status(400).json({ error: "Erro ao encontrar transação" });
  }
});

import { Payment, MercadoPagoConfig } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken:
    "TEST-5565133071050132-021318-483ffb67b39c4695bb7bc30752123c4d-453483656",
});
const payment = new Payment(client);

routes.post("/checkout", CreateToken, async (req, res) => {
    console.log("teste1");
    console.log(req.middlewareToken);
    
  
    try {
      console.log("teste2");
  
      console.log("teste3");
      const getTransactionAmount = () => {
        const value = String(Math.floor(Math.random() * 990) + 10);
        return value;
      };
  
      payment.create({
        body: {
          transaction_amount: Number(req.body.transactionAmount),
          token: req.middlewareToken,
          description: req.body.description,
          installments: Number(req.body.installments),
          payment_method_id: req.body.payment_method_id,
          issuer_id: req.body.issuer_id,
          payer: {
            email: req.body.email,
            identification: {
              type: req.body.identificationType,
              number: req.body.identificationNumber,
            },
          },
        },
        requestOptions: { idempotencyKey: getTransactionAmount() },
      })
      .then(function (data) {
        console.log(data);
        
        res.status(201).json({
          detail: data.status_detail,
          status: data.status,
          id: data.id,
        });
      })
      .catch(function (error) {
        console.log(error);
          
      });
      
  
    } catch (err:any) {
      console.log("teste6");
      console.log(err);
      
      if (err.cause && err.cause.length > 0) {
        if (err.cause[0].code === 2131) {
          return res
            .status(405)
            .json({ err });
        } else if (err.cause[0].code === 3003) {
          return res
            .status(401)
            .json({ message: "Processamento card_id_token inválido", err });
        }
      }
      return res
        .status(400)
        .json({ message: "Erro ao processar pagamento", err });
    }
  });
  

module.exports = routes;
