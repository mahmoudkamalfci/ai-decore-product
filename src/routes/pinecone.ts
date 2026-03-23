import { Router } from "express";
import { seedPinecone } from "../services/pinecone.service";

const router = Router();

router.post("/seed", async (_req, res) => {
  try {
    await seedPinecone();
    res.status(200).json({ message: "Pinecone index created and records seeded successfully." });
  } catch (error) {
    console.error("Error during Pinecone seed initialization:", error);
    res.status(500).json({ 
      error: "Failed to initialize and seed Pinecone.", 
      details: (error as Error).message 
    });
  }
});

export default router;
