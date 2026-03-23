import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { pinecone } from "../config/pinecone";
import { INDEX_NAME, NAMESPACE } from "./pinecone.service";

export const askQuestion = async (question: string) => {
  const index = pinecone.index(INDEX_NAME);
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex: index, namespace: NAMESPACE }
  );
  
  const retriever = vectorStore.asRetriever({ k: 3 });
  
  const prompt = PromptTemplate.fromTemplate(`
    Answer the question based only on the context:
    Context: {context}
    Question: {question}
  `);

  const ragChain = RunnableSequence.from([
    {
      context: retriever.pipe((docs) => docs.map((d) => d.pageContent).join("\n")),
      question: new RunnablePassthrough(),
    },
    prompt,
    new ChatOpenAI({ modelName: "gpt-4o" }),
    new StringOutputParser(),
  ]);

  return await ragChain.invoke(question);
};
