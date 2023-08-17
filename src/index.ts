import * as dotenv from "dotenv";
import { XataVectorSearch } from "langchain/vectorstores/xata";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { XataChatMessageHistory } from "langchain/stores/message/xata";
import { ChatOpenAI } from "langchain/chat_models/openai";

import { getXataClient } from "./xata.ts";

dotenv.config();

const client = getXataClient();

/* Create the vector store */
const table = "docs";
const embeddings = new OpenAIEmbeddings();
const vectorStore = new XataVectorSearch(embeddings, { client, table });

/* Add documents to the vector store */
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

const ids = await vectorStore.addDocuments(docs);

// eslint-disable-next-line no-promise-executor-return
await new Promise((r) => setTimeout(r, 2000));

/* Create the chat memory store */
const memory = new BufferMemory({
  chatHistory: new XataChatMessageHistory({
    table: "memory",
    sessionId: new Date().toISOString(), // Or some other unique identifier for the conversation
    client,
    createTable: false,
  }),
  memoryKey: "chat_history",
});

/* Initialize the LLM to use to answer the question */
const model = new ChatOpenAI({});

/* Create the chain */
const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    memory,
  }
);

/* Ask it a question */
const question = "What is Xata?";
const res = await chain.call({ question });
console.log("Question: ", question);
console.log(res);
/* Ask it a follow up question */
const followUpQ = "Can it do vector search?";
const followUpRes = await chain.call({
  question: followUpQ,
});
console.log("Follow-up question: ", followUpQ);
console.log(followUpRes);

/* Clear both the vector store and the memory store */
await vectorStore.delete({ ids });
await memory.clear();
