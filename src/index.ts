import { Command } from "commander";
import { execSync } from "child_process";
import { analyzeCommit } from "./ai/adapter";
import { generateQuestions } from "./ai/questions";
import readline from "readline";

const program = new Command();

async function askQuestions(questions: string[]) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answers: string[] = [];

  for (const q of questions) {
    const answer = await new Promise<string>((resolve) => {
      rl.question(q + "\n> ", resolve);
    });
    answers.push(answer);
  }

  rl.close();
  return answers;
}

program
  .command("scan")
  .description("Scan the latest commit and analyze knowledge")
  .action(async () => {
    try {
      // Check if inside git repo
      execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });

      // Get commit count
      const commitCount = execSync("git rev-list --count HEAD")
        .toString()
        .trim();

      let diff = "";

      if (commitCount === "1") {
        console.log("🟢 First commit detected.");

        // Compare first commit with empty tree
        const emptyTreeHash =
          "4b825dc642cb6eb9a060e54bf8d69288fbee4904";

        diff = execSync(`git diff ${emptyTreeHash} HEAD`).toString();
      } else {
        diff = execSync("git diff HEAD~1 HEAD").toString();
      }

      if (!diff.trim()) {
        console.log("No changes detected in the latest commit.");
        return;
      }

      console.log("Changes detected:\n");

      const analysis = await analyzeCommit(diff);
      console.log(analysis);
      const parsedAnalysis = JSON.parse(analysis);
      const questions = await generateQuestions(
        parsedAnalysis.concepts
      );
      console.log("\n🧠 Generated Questions:\n");

      questions.forEach((q: string, index: number) => {
        console.log(`${index + 1}. ${q}`);
      });

      // 🚀 Start Interactive Mode
      console.log("\n✍️ Please answer the following questions:\n");

      const answers = await askQuestions(questions);

      console.log("\n✅ Your Answers:");
      answers.forEach((ans, index) => {
        console.log(`Q${index + 1}: ${questions[index]}`);
        console.log(`A: ${ans}\n`);
      });

    } catch (error) {
      console.error("❌ Error:");
      console.error(
        "Make sure you are inside a valid git repository with at least one commit."
      );
    }
  });

program.parse(process.argv);
