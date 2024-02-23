"use client"
import axios, { InternalAxiosRequestConfig } from "axios";
import Link from "next/link";
import { FormEvent, useState } from "react";

interface FormData {
  email?: string;
  nome?: string;
  cpf?: string;
}

const api = axios.create({
  baseURL: "https://api.mercadopago.com",
});

const formReducer = (state: FormData, event: { name: string; value: string }) => {
  return {
    ...state,
    [event.name]: event.value,
  };
};

function App() {
  const [formData, setFormData] = useState<FormData>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Gerando um identificador único para o cabeçalho X-Idempotency-Key
    const idempotencyKey = `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
    const token = "TEST-5565133071050132-021318-483ffb67b39c4695bb7bc30752123c4d-453483656";

    const body = {
      transaction_amount: 10,
      token: token ,
      description: "",
      payment_method_id: "pix",
      payer: {
        email: formData.email || "",
        first_name: formData.nome || "",
        last_name: " ",
        identification:{
          type: "CPF",
          number: formData.cpf || ""
        }
      },
      notification_url: "https://eoe0dc9qtr0leec.m.pipedream.net"
    };

    try {
      const response = await api.post("v1/payments", body, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Idempotency-Key': idempotencyKey
        }
      });
      console.log("Resposta da API:", response.data);
    } catch (error) {
      console.error("Erro ao enviar requisição:", error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full flex-col h-screen">
      <p>PIX com API do Mercado Pago</p>
      <br />
      <br />
      <form onSubmit={(e: FormEvent) => handleSubmit(e)}>
        <div>
          <label htmlFor="">Email</label>
          <input className="text-black" type="text" name="email" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="">Nome</label>
          <input className="text-black" type="text" name="nome" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="">CPF</label>
          <input className="text-black" type="text" name="cpf" onChange={handleChange} />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <Link href={"/"}>
      Prev
      </Link>
    </div>
  );
}

export default App;
