import { NextFunction, Request, Response } from "express";

const axios = require("axios");
const access_token = "TEST-5565133071050132-021318-483ffb67b39c4695bb7bc30752123c4d-453483656"

declare global {
    namespace Express {
      interface Request {
        middlewareToken?: string; // Defina o tipo de middlewareToken conforme necessário
      }
    }
  }

async function CreateToken(req: Request, res: Response, next: NextFunction){
    try {
        const cardData = {
            card_number: req.body.cardNumber,
            cardholder: {
                name: req.body.cardName,
                identification: {
                    type: req.body.identificationType,
                    number: req.body.identificationNumber,
                },
            },
            expiration_month: req.body.expirationMonth,
            expiration_year: req.body.expirationYear,
            security_code: req.body.securityCode,
            transaction_amount: req.body.transactionAmount,
            installments: req.body.installments,
        };
        console.log(cardData);
        
        const response = await axios.post(
            'https://api.mercadopago.com/v1/card_tokens',
            cardData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        if(response){
            console.log(response);
            
        }
        const paymentToken = response.data.id;
        if(paymentToken){
            console.log("tem token!!!!");
            console.log(paymentToken);
            
            
        }
        req.middlewareToken = paymentToken;
        next();
    } catch (err) {
        console.log(err);
        
        return res.status(400).json({ message: 'Erro ao gerar Token de pagamento', err});
    }
};
export {
    CreateToken
}
