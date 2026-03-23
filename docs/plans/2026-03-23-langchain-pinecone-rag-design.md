# LangChain Pinecone RAG Architecture Design

## 1. Overview
Implement a LangChain-powered RAG (Retrieval-Augmented Generation) flow built on top of Pinecone and OpenAI embeddings. Transitioning from Pinecone's native integrated embeddings to standard LangChain vectors.

## 2. Pinecone Index Transition
- Change index name from `developer-quickstart-js` to `developer-rag-index`.
- Modify Pinecone creation logic to drop native `llama-text-embed-v2` configuration.
- Provision standard Pinecone Index pointing to OpenAI's token dimension (`dimension: 1536`, `metric: 'cosine'`).
- Rework the data seeding script (`seedPinecone`) to iterate records and emit `PineconeStore.fromDocuments` calls powered by `new OpenAIEmbeddings()`.

## 3. Libraries & Dependencies
- `@langchain/pinecone`
- `@langchain/openai`
- `@langchain/core`

## 4. Components

### A. RAG Service (`src/services/rag.service.ts`)
Creates a functional LangChain execution environment utilizing LangChain Expression Language (LCEL).
- Locates Pinecone index via `fromExistingIndex` attached to `OpenAIEmbeddings`.
- Formulates a system `PromptTemplate`.
- Implements `RunnableSequence` piping context mapped to strings into `ChatOpenAI` initialized for `gpt-4o`.
- Exports `askQuestion(question: string): Promise<string>` triggering the LCEL sequence on-demand.

### B. Router Integration (`src/routes/rag.ts`)
- Configures generic Express routing pipeline logic parsing inputs from `.body`.
- Accepts `POST /api/rag/ask` with JSON strictly defining a `{ "question": "..." }` payload.
- Wires `.invoke` result into the response payload alongside base status codes, gracefully exposing execution to consumers.
