import { Request, Response } from "express";

async function DefaultRoute(req: Request, res: Response) {
    res.status(200).json({msg: "bem vindo ao microserviço da urban vogue para pagamentos utilizando o mercado pago!"})
}

export default {
  DefaultRoute
};