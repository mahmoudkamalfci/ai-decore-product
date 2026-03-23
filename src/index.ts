import express from "express";
import baseRouter from "./routes/base";
import pineconeRouter from "./routes/pinecone";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/", baseRouter);
app.use("/api/pinecone", pineconeRouter);

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}
