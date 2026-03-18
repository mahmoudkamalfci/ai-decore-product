import express from "express";
import baseRouter from "./routes/base";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", baseRouter);

if (require.main === module) {
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}
