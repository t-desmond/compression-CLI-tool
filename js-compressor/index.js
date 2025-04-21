const fs = require("fs/promises");
const path = require("path");
const lz = require("./lz");
const rle = require("./rle");

const args = process.argv.slice(2);

const command = args[1];
const inputFile = args[3];
const algorithm = args[5];
const outputFile = args[7];

if (!command || !inputFile || !algorithm) {
  console.log(
    "Usage: node index.js --command compress --input input.txt --algorithm lz [--output output.txt]"
  );
  process.exit(1);
}

async function main() {
  try {
    const data = await fs.readFile(inputFile);

    let result;

    if (command === "compress") {
      if (algorithm === "lz") {
        result = lz.compress(data);
      } else if (algorithm === "rle") {
        result = rle.compress(data);
      } else {
        throw new Error("Unsupported algorithm");
      }
    } else if (command === "decompress") {
      if (algorithm === "lz") {
        result = lz.decompress(data);
      } else if (algorithm === "rle") {
        result = rle.decompress(data);
      } else {
        throw new Error("Unsupported algorithm");
      }
    } else {
      throw new Error("Unsupported command");
    }

    let outputPath;

    if (outputFile) {
      outputPath = outputFile;
    } else {
      const baseName = path.basename(inputFile);
      const outputDir = command === "compress" ? "compressed" : "decompressed";
      const extension = command === "compress" ? `.${algorithm}` : ".out";
      outputPath = path.join(outputDir, baseName + extension);
    }

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, result);

    await fs.writeFile(outputPath, result);
    console.log(`✅ Done! Output saved to: ${outputPath}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

main();
