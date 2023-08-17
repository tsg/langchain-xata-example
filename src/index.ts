import * as dotenv from "dotenv";
import { XataVectorSearch } from "langchain/vectorstores/xata";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";

import { getXataClient } from "./xata.ts";

dotenv.config();

const client = getXataClient();

const table = "docs";
const embeddings = new OpenAIEmbeddings();
const store = new XataVectorSearch(embeddings, { client, table });

// Add documents
const docs = [
  new Document({
    pageContent: "Xata is a Serverless Data platform based on PostgreSQL",
  }),
  new Document({
    pageContent:
      "Xata offers a built-in vector type that can be used to store and query vectors",
  }),
  new Document({
    pageContent: "Xata includes similarity search",
  }),
];

const ids = await store.addDocuments(docs);

// eslint-disable-next-line no-promise-executor-return
await new Promise((r) => setTimeout(r, 2000));

const model = new OpenAI();
const chain = VectorDBQAChain.fromLLM(model, store, {
  k: 1,
  returnSourceDocuments: true,
});
const response = await chain.call({ query: "What is Xata?" });

console.log(JSON.stringify(response, null, 2));

// await store.delete({ ids });
