import type { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import {
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pinecone } from "../config/pinecone";
import { INDEX_NAME, NAMESPACE } from "./pinecone.service";

let vectorStore: PineconeStore | null = null;

const getVectorStore = async () => {
	if (vectorStore) return vectorStore;
	const index = pinecone.index(INDEX_NAME);
	vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), {
		pineconeIndex: index,
		namespace: NAMESPACE,
	});
	return vectorStore;
};

export const askQuestion = async (question: string) => {
	const store = await getVectorStore();

	const retriever = store.asRetriever({ k: 3 });

	const prompt = PromptTemplate.fromTemplate(`
    Answer the question based only on the context:
    Context: {context}
    Question: {question}
  `);

	const ragChain = RunnableSequence.from([
		{
			context: retriever.pipe((docs: Document[]) =>
				docs.map((d: Document) => d.pageContent).join("\n"),
			),
			question: new RunnablePassthrough(),
		},
		prompt,
		new ChatOpenAI({ modelName: "gpt-4o" }),
		new StringOutputParser(),
	]);

	return await ragChain.invoke(question);
};
