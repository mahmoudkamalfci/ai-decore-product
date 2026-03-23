import type { IndexList } from "@pinecone-database/pinecone";
import { pinecone } from "../config/pinecone";

export const INDEX_NAME = "developer-quickstart-js";
export const NAMESPACE = "ns1";

// Note: ID changed from `_id` to `id` properly adhering to Pinecone's API formats.
export const records = [
	{
		id: "rec1",
		chunk_text:
			"The Eiffel Tower was completed in 1889 and stands in Paris, France.",
		category: "history",
	},
	{
		id: "rec2",
		chunk_text: "Photosynthesis allows plants to convert sunlight into energy.",
		category: "science",
	},
	{
		id: "rec3",
		chunk_text: "Albert Einstein developed the theory of relativity.",
		category: "science",
	},
	{
		id: "rec4",
		chunk_text: "The mitochondrion is often called the powerhouse of the cell.",
		category: "biology",
	},
	{
		id: "rec5",
		chunk_text:
			"Shakespeare wrote many famous plays, including Hamlet and Macbeth.",
		category: "literature",
	},
	{
		id: "rec6",
		chunk_text: "Water boils at 100°C under standard atmospheric pressure.",
		category: "physics",
	},
	{
		id: "rec7",
		chunk_text:
			"The Great Wall of China was built to protect against invasions.",
		category: "history",
	},
	{
		id: "rec8",
		chunk_text:
			"Honey never spoils due to its low moisture content and acidity.",
		category: "food science",
	},
	{
		id: "rec9",
		chunk_text: "The speed of light in a vacuum is approximately 299,792 km/s.",
		category: "physics",
	},
	{
		id: "rec10",
		chunk_text: "Newton's laws describe the motion of objects.",
		category: "physics",
	},
];

export const seedPinecone = async () => {
	console.log("Fetching index list from Pinecone...");
	let indexList: IndexList;
	try {
		indexList = await pinecone.listIndexes();
	} catch (error) {
		console.error("Failed to list indexes:", error);
		throw new Error("Failed connecting to Pinecone.");
	}

	const indexExists = indexList?.indexes?.some(
		(idx) => idx.name === INDEX_NAME,
	);

	if (!indexExists) {
		console.log(`Creating index '${INDEX_NAME}'...`);
		await pinecone.createIndexForModel({
			name: INDEX_NAME,
			cloud: "aws",
			region: "us-east-1",
			embed: {
				model: "llama-text-embed-v2",
				fieldMap: { text: "chunk_text" },
			},
			waitUntilReady: true,
		});
		console.log(`Index '${INDEX_NAME}' created successfully.`);
	} else {
		console.log(`Index '${INDEX_NAME}' already exists. Skipping creation.`);
	}

	// Target the integrated index
	const index = pinecone.index(INDEX_NAME).namespace(NAMESPACE);

	console.log(
		`Seeding ${records.length} records into namespace '${NAMESPACE}'...`,
	);
	// Note: For integrated indexes, passing an object with 'records' to satisfy types
	await index.upsertRecords({ records });
	console.log("Records seeded successfully.");
};
