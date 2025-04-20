const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filePath, inputPath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    // Command to compile the C file and then execute the compiled binary
    let command = `gcc ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out`;
    if (inputPath) {
      command += ` < ${inputPath}`;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        //console.error("Compilation error:", error);
        reject(new Error(`Compilation error: ${error.message}`));
      } else if (stderr) {
        // console.error("Runtime Error:", stderr);
        reject(new Error(`Runtime error: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
};

module.exports = {
  executeC,
};
