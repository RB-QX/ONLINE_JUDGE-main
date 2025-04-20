const { executeCpp } = require("./executeCpp.js");
const { executePython } = require("./executePython.js");
const { executeJava } = require("./executeJava.js");
const { executeC } = require("./executeC.js");
const { executeJavaScript } = require("./executeJs.js");

const executeCode = async (language, filePath, inputPath) => {
  try {
    let output;

    if (language === "cpp") {
      // console.log("inside language");
      output = await executeCpp(filePath, inputPath);
      //console.log(output);
    } else if (language === "c") {
      console.log(language);
      output = await executeC(filePath, inputPath);
    } else if (language === "js") {
      output = await executeJavaScript(filePath, inputPath);
    } else if (language === "java") {
      output = await executeJava(filePath, inputPath);
    } else if (language === "py") {
      output = await executePython(filePath, inputPath);
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }

    return output;
  } catch (error) {
    throw new Error(
      `Error executing in executtecode ${language} code: ${error}`
    );
  }
};

module.exports = { executeCode };
