import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
	res.send("Hello World! The API is running.");
});

export default router;
