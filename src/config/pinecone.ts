import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const pineconeApiKey = process.env.PINECONE_API_KEY;

if (!pineconeApiKey) {
  console.error("PINECONE_API_KEY must be set in the environment.");
}

export const pinecone = new Pinecone({
  apiKey: pineconeApiKey || "",
});
