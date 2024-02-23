"use client";
import axios from "axios";
import { FormEvent, useState } from "react";
const mercadopago = require("mercadopago");

interface FormData {
  email?: string;
  nome?: string;
  cpf?: string;
  numeroCartao?: string;
  titularCartao?: string;
  dataExpiracao?: string;
  cvv?: string;
}

const api = axios.create({
  baseURL: "https://api.mercadopago.com",
});

function Card() {
  const [formData, setFormData] = useState<FormData>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const token = await getToken(formData);

    if (!token) {
      console.error("Erro ao obter token do cartão");
      return;
    }

    const body = {
      token: token,
      description: "Descrição do pagamento",
      transaction_amount: getTransactionAmount(), // Valor do pagamento
      payment_method_id: "visa",
      payer: {
        email: formData.email,
      },
    };

    try {
    } catch (error) {
      console.error("Erro ao enviar requisição:", error);
    }
  };

  const client = new mercadopago.MercadoPagoConfig({
    accessToken:
      "TEST-5565133071050132-021318-483ffb67b39c4695bb7bc30752123c4d-453483656",
  });

  const getToken = async (data: FormData): Promise<string> => {
    return new Promise((resolve, reject) => {
      const cardData = {
        transaction_amount: getTransactionAmount(), // Valor do pagamento
        payment_method_id: "visa",
        card_number: data.numeroCartao || "",
      };
      const teste = {};
      const payment = new mercadopago.Payment(client);

      payment
        .create({ body: cardData })
        .then(function (data: any) {
          console.log(data);
          resolve("seila");
        })
        .catch(function (error: any) {
          console.log(error);
          reject("seila failed");
        });
    });
  };

  const getTransactionAmount = (): number => {
    // Obtenha o valor do pagamento de acordo com o seu produto ou serviço
    // Por exemplo, você pode usar uma variável de estado ou uma propriedade do componente
    // Neste exemplo, vamos usar um valor aleatório entre 10 e 1000
    return Math.floor(Math.random() * 990) + 10;
  };

  return (
    <div className="flex justify-center items-center w-full flex-col h-screen">
      <p>Pagamento com Cartão de Crédito</p>
      <br />
      <br />
      <form onSubmit={(e: FormEvent) => handleSubmit(e)}>
        <div>
          <label htmlFor="">Email</label>
          <input
            className="text-black"
            type="text"
            name="email"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="">Nome</label>
          <input
            className="text-black"
            type="text"
            name="nome"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="">CPF</label>
          <input
            className="text-black"
            type="text"
            name="cpf"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="">Número do Cartão</label>
          <input
            className="text-black"
            type="text"
            name="numeroCartao"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="">Titular do Cartão</label>
          <input
            className="text-black"
            type="text"
            name="titularCartao"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="">Data de Expiração (MM/AA)</label>
          <input
            className="text-black"
            type="text"
            name="dataExpiracao"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="">CVV</label>
          <input
            className="text-black"
            type="text"
            name="cvv"
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Card;
