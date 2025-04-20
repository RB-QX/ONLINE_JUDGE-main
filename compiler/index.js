const express = require("express");
const app = express();
const { generateFile } = require("./generateFile");

const cors = require("cors");

const { generateInputFile } = require("./generateInputFile.js");
const { executeCode } = require("./executeCode");

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ online: "compiler" });
});

app.post("/run", async (req, res) => {
  const { language, code, input } = req.body;

  if (!code) {
    return res.status(200).json({ success: false, error: "Empty code!" });
  }

  try {
    // Generate a unique file path for the code file
    const filePath = await generateFile(language, code);

    // Generate a unique file path for the input file (if provided)

    const inputPath = await generateInputFile(input);

    // Execute code using executeCode function

    //console.log(inputPath);
    const output = await executeCode(language, filePath, inputPath);
    /// const output = await executeCode(filePath,language,  input);
    //console.log("indexoutput", output);
    // Return response with file paths and output
    res.json({ filePath, inputPath, output });
  } catch (error) {
    //console.error("Error executing code in index: 1", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.COMPILER_PORT||5001;
const server = app.listen(PORT, () => {
  console.log(`🛠️  Compiler service listening on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌  Port ${PORT} already in use. ` +
                  `Set COMPILER_PORT to another value or stop the conflicting process.`);
    process.exit(1);
  } else {
    console.error(err);
  }
});
