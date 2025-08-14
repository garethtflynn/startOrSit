import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // explicitly load from .env.local

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const runTest = async () => {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: "write a haiku about ai",
    store: true,
  });
  console.log(response.output_text);
};

runTest();
