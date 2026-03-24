import { type Request, type Response, Router } from "express";
import { askQuestion } from "../services/rag.service";

const router = Router();

router.post("/ask", async (req: Request, res: Response): Promise<void> => {
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
