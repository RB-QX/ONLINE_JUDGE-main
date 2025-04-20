// const { exec } = require("child_process");
// //const path = require("path");

// // const executeJavaScript = (filepath) => {
// //   return new Promise((resolve, reject) => {
// //     exec(`node ${filepath}`, (error, stdout, stderr) => {
// //       if (error) {
// //         reject({ error, stderr });
// //       }
// //       if (stderr) {
// //         reject(stderr);
// //       }
// //       resolve(stdout);
// //     });
// //   });
// // };
// // const executeJavaScript = (filepath, inputPath) => {
// //   return new Promise((resolve, reject) => {
// //     const process = exec(
// //       `node ${filepath} < ${inputPath}`,
// //       (error, stdout, stderr) => {
// //         if (error) {
// //           reject({ error, stderr });
// //         }
// //         if (stderr) {
// //           reject(stderr);
// //         }
// //         resolve(stdout);
// //       }
// //     );
// //     if (input) {
// //       process.stdin.write(input);
// //       process.stdin.end();
// //     }
// //   });
// // };

// // module.exports = {
// //   executeJavaScript,
// // };

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const executeJavaScript = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    // Check if inputPath is provided and read its content
    if (inputPath) {
      fs.readFile(inputPath, "utf8", (err, data) => {
        if (err) {
          return reject({ error: err });
        }

        // Spawn the node process and write the input data to stdin
        const process = spawn("node", [filepath]);

        let stdout = "";
        let stderr = "";

        process.stdout.on("data", (data) => {
          stdout += data;
        });

        process.stderr.on("data", (data) => {
          stderr += data;
        });

        process.on("close", (code) => {
          if (code !== 0) {
            return reject({
              error: new Error(`Process exited with code ${code}`),
              stderr,
            });
          }
          if (stderr) {
            return reject(stderr);
          }
          resolve(stdout);
        });

        // Write input data to the process's stdin
        process.stdin.write(data);
        process.stdin.end();
      });
    } else {
      // If no inputPath is provided, simply run the Node.js process
      const process = spawn("node", [filepath]);

      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data;
      });

      process.stderr.on("data", (data) => {
        stderr += data;
      });

      process.on("close", (code) => {
        if (code !== 0) {
          return reject({
            error: new Error(`Process exited with code ${code}`),
            stderr,
          });
        }
        if (stderr) {
          return reject(stderr);
        }
        resolve(stdout);
      });
    }
  });
};

module.exports = {
  executeJavaScript,
};
