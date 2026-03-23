# LangChain Pinecone RAG Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a Retrieval-Augmented Generation (RAG) system using LangChain, Pinecone, and OpenAI embeddings exposed via an Express REST endpoint.

**Architecture:** Transition the existing Pinecone setup from integrated embeddings to a standard index driven by OpenAI embeddings. Incorporate LangChain's LCEL for retrieval and generation orchestration. Expose this RAG sequence through a standardized express REST endpoint.

**Tech Stack:** TypeScript, Express, LangChain (`@langchain/core`, `@langchain/openai`, `@langchain/pinecone`), Pinecone, Jest

---

### Task 1: Install Dependencies

**Step 1: Install packages**

Run: `pnpm add @langchain/pinecone @langchain/openai @langchain/core`
Expected: Packages installed successfully.

**Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add langchain dependencies for RAG implementation"
```

### Task 2: Refactor Pinecone Setup & Seeder

**Files:**
- Modify: `src/services/pinecone.service.ts`

**Step 1: Write the failing test**
Create a test file `tests/pinecone.service.test.ts` (mocking Pinecone) to ensure index creation params are correct.
*(To save complexity, verify typescript compiler checks pass for new Pinecone methods instead of deep mocking)*
Just update `src/services/pinecone.service.ts` directly for infrastructure:

**Step 2: Write minimal implementation**
- Change `INDEX_NAME = "developer-rag-index"`
- Change `NAMESPACE = "rag-namespace"`
- Map `records` properly to LangChain `Document` objects.
- Modify `createIndexForModel` to:
```typescript
await pinecone.createIndex({
  name: INDEX_NAME,
  dimension: 1536, // OpenAI dimension
  metric: 'cosine',
  spec: {
    serverless: {
      cloud: 'aws',
      region: 'us-east-1'
    }
  }
});
```
- Update seeding logic to use `PineconeStore.fromDocuments`:
```typescript
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";

// inside seed module:
const docs = records.map(r => ({ pageContent: r.chunk_text, metadata: { category: r.category, id: r.id } }));
await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings(), {
  pineconeIndex: pinecone.index(INDEX_NAME),
  namespace: NAMESPACE,
});
```

**Step 3: Verify build**
Run: `pnpm run build`
Expected: Compiler passes.

**Step 4: Commit**
```bash
git add src/services/pinecone.service.ts
git commit -m "refactor: update pinecone seeder to use standard index and LangChain PineconeStore"
```

### Task 3: Implement RAG Service

**Files:**
- Create: `src/services/rag.service.ts`

**Step 1: Write minimal implementation**
Create `src/services/rag.service.ts`:
```typescript
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
      context: retriever.pipe((docs) => docs.map((d) => d.pageContent).join("\\n")),
      question: new RunnablePassthrough(),
    },
    prompt,
    new ChatOpenAI({ modelName: "gpt-4o" }),
    new StringOutputParser(),
  ]);

  return await ragChain.invoke(question);
};
```

**Step 2: Verify build**
Run: `pnpm run build`
Expected: Compiler passes.

**Step 3: Commit**
```bash
git add src/services/rag.service.ts
git commit -m "feat: implement langchain LCEL rag service sequence"
```

### Task 4: API Route Integration

**Files:**
- Create: `src/routes/rag.ts`
- Modify: `src/index.ts`

**Step 1: Write minimal implementation**
Create `src/routes/rag.ts`:
```typescript
import { Router } from "express";
import { askQuestion } from "../services/rag.service";

const router = Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      res.status(400).json({ error: "Missing 'question' in body." });
      return;
    }
    const answer = await askQuestion(question);
    res.status(200).json({ answer });
  } catch (error) {
    console.error("Error asking question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
```

Modify `src/index.ts` to include route:
```typescript
import ragRouter from "./routes/rag";
// under app.use("/api/pinecone", pineconeRouter);
app.use("/api/rag", ragRouter);
```

**Step 2: Verify Application Flow**
Run: `pnpm run build`
Expected: Valid compilation.

**Step 3: Commit**
```bash
git add src/routes/rag.ts src/index.ts
git commit -m "feat: expose POST /api/rag/ask endpoint for RAG queries"
```
