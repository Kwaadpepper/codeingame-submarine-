const fs = require('fs')
const path = require('path')
const formater = require('typescript-formatter')

const separation = "\n\n// ------\n"
const sourcePath = "./src/classes";
const sourceIndexPath = "./src/index.ts";
const outFilePath = "./dist/index.ts";

// remove out if exists
if (fs.existsSync(outFilePath)) {
    fs.rmSync(outFilePath)
}

// create dir if does not exists
if (!fs.existsSync("./dist")) {
    fs.mkdirSync("./dist")
}

// create file
fs.writeFileSync(outFilePath, "")

// Write TS definitions
fs.writeFileSync(
    fs.realpathSync(outFilePath),
    removeNamespace(fs.readFileSync(fs.realpathSync("./src/types/global.d.ts")).toString())
);

for (const filePath of walkSync(sourcePath)) {
    appendSeparation()
    fs.appendFileSync(
        fs.realpathSync(outFilePath),
        removeNamespace(fs.readFileSync(`${sourcePath}/${filePath}`).toString())
    );
}

appendSeparation()

// Write index.ts
fs.appendFileSync(
    fs.realpathSync(outFilePath),
    removeNamespace(fs.readFileSync(sourceIndexPath).toString())
);

/** @param string*/
function removeNamespace(string) {
    return string.replace("namespace TS {", "")
        .replace(/}\n.*$/, '')
        .replaceAll(/^\n    /g, "\n")
        .replaceAll("export ", "")
}

function appendSeparation() {
    fs.appendFileSync(
        fs.realpathSync(outFilePath),
        separation
    );
}

function *walkSync(dir, base="") {
    const files = fs.readdirSync(dir, { withFileTypes: true }).sort()
    for (const file of files) {
        if (file.isDirectory()) {
            yield* walkSync(path.join(dir, file.name), path.join(base, file.name));
        } else {
            yield path.join(base, file.name);
        }
    }
}
