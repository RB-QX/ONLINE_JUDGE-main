// const express = require("express");
// const { generateFile } = require("../../compiler/generateFile");
// const { generateInputFile } = require("../../compiler/generateInputFile");
// const { executeCode } = require("../../compiler/executeCode");
// const User = require("../model/User");
// const Problem = require("../model/Problem");
// const Submission = require("../model/Submission");
// const UserSolvedProblems = require("../model/UserSolvedProblem");
// const router = express.Router();

// router.post("/submit", async (req, res) => {
//   const { userId, problemId, code, language, input } = req.body;

//   console.log("Request body:", req.body);
//   if (!language || !code || !problemId || !userId) {
//     return res.status(400).json({
//       success: false,
//       error: "Information missing while running code",
//     });
//   }

//   try {
//     const userinfo = await User.findById(userId);
//     if (!userinfo) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Unauthorized user" });
//     }

//     const problem = await Problem.findById(problemId);
//     if (!problem) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Problem not found" });
//     }

//     const filePath = await generateFile(language, code);

//     const isSubmit = req.body.isSubmit || false;
//     if (!isSubmit) {
//       const inputPath = await generateInputFile(input);
//       const output = await executeCode(language, filePath, inputPath);
//       return res.json({ filePath, inputPath, output });
//     } else {
//       let pass = 0;
//       for (let i = 0; i < problem.testCases.length; i++) {
//         const testCaseInput = problem.testCases[i].input;
//         const expectedOutput = problem.testCases[i].output;

//         const inputFilePath = await generateInputFile(testCaseInput);
//         const actualOutput = await executeCode(
//           language,
//           filePath,
//           inputFilePath
//         );

//         if (actualOutput.trim() !== expectedOutput.trim()) {
//           console.log(`Test case ${i + 1} failed`);
//           problem.total_submissions += 1;
//           await problem.save();

//           const submission = new Submission({
//             problem: problem._id,
//             user: userinfo._id,
//             code,
//             language,
//             problemName: problem.title,
//             verdict: `WA on TC ${
//               pass + 1
//             }\nWrong TestCase: \n${testCaseInput}\nYour output:\n${actualOutput}\nCorrect output:\n${expectedOutput}`,
//           });
//           await submission.save();
//           userinfo.problems_submitted.push(submission._id);
//           await userinfo.save();

//           // Update UserSolvedProblems
//           let userSolvedProblems = await UserSolvedProblems.findOne({
//             user: userId,
//           });
//           if (!userSolvedProblems) {
//             userSolvedProblems = new UserSolvedProblems({ user: userId });
//           }
//           const solvedProblemIndex =
//             userSolvedProblems.solvedProblems.findIndex(
//               (sp) => sp.problem.toString() === problemId
//             );
//           if (solvedProblemIndex === -1) {
//             userSolvedProblems.solvedProblems.push({
//               problem: problemId,
//               verdict: "Wrong Answer",
//             });
//           } else if (
//             userSolvedProblems.solvedProblems[solvedProblemIndex].verdict !==
//             "Accepted"
//           ) {
//             userSolvedProblems.solvedProblems[solvedProblemIndex].verdict =
//               "Wrong Answer";
//           }
//           await userSolvedProblems.save();

//           return res.json({
//             wrongTC: testCaseInput,
//             YourOutput: actualOutput,
//             CorrectOutput: expectedOutput,
//             pass,
//             isCorrect: false,
//           });
//         } else {
//           pass++;
//         }
//       }

//       problem.total_accepted += 1;
//       problem.total_submissions += 1;
//       await problem.save();

//       const submission = new Submission({
//         problem: problem._id,
//         user: userinfo._id,
//         code,
//         language,
//         problemName: problem.title,
//         verdict: "Accepted",
//       });
//       await submission.save();
//       userinfo.problems_submitted.push(submission._id);
//       await userinfo.save();

//       // Update UserSolvedProblems
//       let userSolvedProblems = await UserSolvedProblems.findOne({
//         user: userId,
//       });
//       if (!userSolvedProblems) {
//         userSolvedProblems = new UserSolvedProblems({ user: userId });
//       }
//       const solvedProblemIndex = userSolvedProblems.solvedProblems.findIndex(
//         (sp) => sp.problem.toString() === problemId
//       );
//       if (solvedProblemIndex === -1) {
//         userSolvedProblems.solvedProblems.push({
//           problem: problemId,
//           verdict: "Accepted",
//         });
//       } else {
//         userSolvedProblems.solvedProblems[solvedProblemIndex].verdict =
//           "Accepted";
//       }
//       await userSolvedProblems.save();

//       return res.json({
//         isCorrect: true,
//         passedtestcase: problem.testCases.length,
//       });
//     }
//   } catch (error) {
//     console.error("Error executing code:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const { generateFile } = require("../../compiler/generateFile");
const { generateInputFile } = require("../../compiler/generateInputFile");
const { executeCode } = require("../../compiler/executeCode");
const User = require("../model/User");
const Problem = require("../model/Problem");
const Submission = require("../model/Submission");
const UserSolvedProblems = require("../model/UserSolvedProblem");
const UserSolvedDate = require("../model/UserSolvedDate");
const router = express.Router();

router.post("/submit", async (req, res) => {
  const { userId, problemId, code, language, input } = req.body;

  console.log("Request body:", req.body);
  if (!language || !code || !problemId || !userId) {
    return res.status(400).json({
      success: false,
      error: "Information missing while running code",
    });
  }

  try {
    const userinfo = await User.findById(userId);
    if (!userinfo) {
      return res
        .status(404)
        .json({ success: false, error: "Unauthorized user" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res
        .status(404)
        .json({ success: false, error: "Problem not found" });
    }

    const filePath = await generateFile(language, code);

    const isSubmit = req.body.isSubmit || false;
    if (!isSubmit) {
      const inputPath = await generateInputFile(input);
      const output = await executeCode(language, filePath, inputPath);
      return res.json({ filePath, inputPath, output });
    } else {
      let pass = 0;
      for (let i = 0; i < problem.testCases.length; i++) {
        const testCaseInput = problem.testCases[i].input;
        const expectedOutput = problem.testCases[i].output;

        const inputFilePath = await generateInputFile(testCaseInput);
        const actualOutput = await executeCode(
          language,
          filePath,
          inputFilePath
        );
        // let actualOutput;
        // try {
        //   actualOutput = await executeCode(language, filePath, inputFilePath);
        //   //res.json({ filePath, inputPath, output });
        // } catch (error) {
        //   console.error("Error executing code in index: 1", error);
        //   res.status(500).json({ error: error.message });
        // }

        if (actualOutput.trim() !== expectedOutput.trim()) {
          console.log(`Test case ${i + 1} failed`);
          problem.total_submissions += 1;
          await problem.save();

          const submission = new Submission({
            problem: problem._id,
            user: userinfo._id,
            code,
            language,
            problemName: problem.title,
            verdict: `WA on TC ${
              pass + 1
            }\nWrong TestCase: \n${testCaseInput}\nYour output:\n${actualOutput}\nCorrect output:\n${expectedOutput}`,
          });
          await submission.save();
          userinfo.problems_submitted.push(submission._id);
          await userinfo.save();

          // Update UserSolvedProblems
          let userSolvedProblems = await UserSolvedProblems.findOne({
            user: userId,
          });
          if (!userSolvedProblems) {
            userSolvedProblems = new UserSolvedProblems({ user: userId });
          }
          const solvedProblemIndex =
            userSolvedProblems.solvedProblems.findIndex(
              (sp) => sp.problem.toString() === problemId
            );
          if (solvedProblemIndex === -1) {
            userSolvedProblems.solvedProblems.push({
              problem: problemId,
              verdict: "Wrong Answer",
            });
          } else if (
            userSolvedProblems.solvedProblems[solvedProblemIndex].verdict !==
            "Accepted"
          ) {
            userSolvedProblems.solvedProblems[solvedProblemIndex].verdict =
              "Wrong Answer";
          }
          await userSolvedProblems.save();

          return res.json({
            wrongTC: testCaseInput,
            YourOutput: actualOutput,
            CorrectOutput: expectedOutput,
            pass,
            isCorrect: false,
          });
        } else {
          pass++;
        }
      }
      if (pass === problem.testCases.length) {
        //problem.solvedDate = new Date(); // Set solvedDate to current date

        // Save solved date for the user
        let userSolvedDate = await UserSolvedDate.findOne({ user: userId });
        if (!userSolvedDate) {
          userSolvedDate = new UserSolvedDate({ user: userId });
        }
        userSolvedDate.solvedDates.push(new Date());
        await userSolvedDate.save();
      }

      // problem.total_accepted += 1;
      // problem.total_submissions += 1;
      // await problem.save();

      const submission = new Submission({
        problem: problem._id,
        user: userinfo._id,
        code,
        language,
        problemName: problem.title,
        verdict: "Accepted",
      });
      await submission.save();
      userinfo.problems_submitted.push(submission._id);
      await userinfo.save();

      // Update UserSolvedProblems
      let userSolvedProblems = await UserSolvedProblems.findOne({
        user: userId,
      });
      if (!userSolvedProblems) {
        userSolvedProblems = new UserSolvedProblems({ user: userId });
      }
      const solvedProblemIndex = userSolvedProblems.solvedProblems.findIndex(
        (sp) => sp.problem.toString() === problemId
      );
      if (solvedProblemIndex === -1) {
        userSolvedProblems.solvedProblems.push({
          problem: problemId,
          verdict: "Accepted",
        });
      } else {
        userSolvedProblems.solvedProblems[solvedProblemIndex].verdict =
          "Accepted";
      }
      await userSolvedProblems.save();

      return res.json({
        isCorrect: true,
        passedtestcase: problem.testCases.length,
      });
    }
  } catch (error) {
    console.error("Error executing code:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Endpoint to get the verdict for a specific user and problem
router.get("/verdict/:userId/:problemId", async (req, res) => {
  const { userId, problemId } = req.params;
  try {
    const submission = await Submission.findOne({
      user: userId,
      problem: problemId,
    }).sort({ createdAt: -1 }); // Get the latest submission

    if (!submission) {
      return res.status(200).json({ verdict: "Unsolved" });
    }

    const verdict = submission.verdict === "Accepted" ? "Solved" : "Unsolved";
    res.status(200).json({ verdict });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

//module.exports = router;

// const express = require("express");
// const { generateFile } = require("../../compiler/generateFile");
// const { generateInputFile } = require("../../compiler/generateInputFile");
// const { executeCode } = require("../../compiler/executeCode");
// const User = require("../model/User");
// const Problem = require("../model/Problem");
// const Submission = require("../model/Submission");
// const UserSolvedDate = require("../model/UserSolvedDate");
// const router = express.Router();

// router.post("/submit", async (req, res) => {
//   const { userId, problemId, code, language, input } = req.body;

//   if (!language || !code || !problemId || !userId) {
//     return res.status(400).json({
//       success: false,
//       error: "Information missing while running code",
//     });
//   }

//   try {
//     const userinfo = await User.findById(userId);
//     if (!userinfo) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Unauthorized user" });
//     }

//     const problem = await Problem.findById(problemId);
//     if (!problem) {
//       return res
//         .status(404)
//         .json({ success: false, error: "Problem not found" });
//     }

//     const filePath = await generateFile(language, code);
//     const isSubmit = req.body.isSubmit || false;

//     if (!isSubmit) {
//       const inputPath = await generateInputFile(input);
//       const output = await executeCode(language, filePath, inputPath);
//       return res.json({ filePath, inputPath, output });
//     } else {
//       let pass = 0;

//       for (let i = 0; i < problem.testCases.length; i++) {
//         const testCaseInput = problem.testCases[i].input;
//         const expectedOutput = problem.testCases[i].output;

//         const inputFilePath = await generateInputFile(testCaseInput);
//         const actualOutput = await executeCode(
//           language,
//           filePath,
//           inputFilePath
//         );
//         console.log(actualoutput);

//         if (actualOutput.trim() !== expectedOutput.trim()) {
//           console.log(`Test case ${i + 1} failed`);
//           problem.total_submissions += 1;
//           await problem.save();

//           const submission = new Submission({
//             problem: problem._id,
//             user: userinfo._id,
//             code,
//             language,
//             problemName: problem.title,
//             verdict: `WA on TC ${
//               pass + 1
//             }\nWrong TestCase: \n${testCaseInput}\nYour output:\n${actualOutput}\nCorrect output:\n${expectedOutput}`,
//           });
//           await submission.save();
//           userinfo.problems_submitted.push(submission._id);
//           await userinfo.save();

//           return res.json({
//             wrongTC: testCaseInput,
//             YourOutput: actualOutput,
//             CorrectOutput: expectedOutput,
//             pass,
//             isCorrect: false,
//           });
//         } else {
//           pass++;
//         }
//       }

//       problem.total_accepted += 1;
//       problem.total_submissions += 1;

//       // Check if all test cases passed
//       if (pass === problem.testCases.length) {
//         problem.solvedDate = new Date(); // Set solvedDate to current date

//         // Save solved date for the user
//         let userSolvedDate = await UserSolvedDate.findOne({ user: userId });
//         if (!userSolvedDate) {
//           userSolvedDate = new UserSolvedDate({ user: userId });
//         }
//         userSolvedDate.solvedDates.push(new Date());
//         await userSolvedDate.save();
//       }

//       await problem.save();

//       const submission = new Submission({
//         problem: problem._id,
//         user: userinfo._id,
//         code,
//         language,
//         problemName: problem.title,
//         verdict: "Accepted",
//       });
//       await submission.save();
//       userinfo.problems_submitted.push(submission._id);
//       await userinfo.save();

//       return res.json({
//         isCorrect: true,
//         passedtestcase: problem.testCases.length,
//       });
//     }
//   } catch (error) {
//     console.error("Error executing code:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
