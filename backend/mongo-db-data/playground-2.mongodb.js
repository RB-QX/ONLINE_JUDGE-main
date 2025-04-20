// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('test');

// Create a new document in the collection.
db.getCollection('problems').insertOne({
    title: "Hello World",
    description: "Print Hello World",
    difficulty: "Easy",
    inputExample: "",
    outputExample: "Hello World",
    constraints: "",
    testCases: [{ input: "", output: "Hello World" }],
    topics: ["Basics"]
});
