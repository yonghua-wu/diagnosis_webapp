const moment = require("moment");
const child_precess = require("child_process");
const { readFile, writeFile } = require("fs");

function getVersionData() {
  const commitHash = child_precess.execSync("git show -s --format=%h").toString().trim();
  const commitDate = moment(new Date(child_precess.execSync("git show -s --format=%cd").toString().trim())).format("YYYY-MM-DD HH:mm:ss");
  const buildDate = moment().format("YYYY-MM-DD HH:mm:ss");
  const lastTagCommitHash = child_precess.execSync("git rev-list --tags --max-count=1").toString().trim();
  const lastTag = child_precess.execSync(`git describe --tags ${lastTagCommitHash}`).toString().trim();
  const version = lastTag.match(/[0-9]+\.[0-9]+\.[0-9]+/).toString();
  return {
    commitDate,
    commitHash,
    buildDate,
    tag: lastTag,
    version,
  };
}

function updatePackageJson(version) {
  readFile("./package.json", (err, data) => {
    err && console.log(err);
    const package = JSON.parse(data);
    package.version = version;
    writeFile("./package.json", JSON.stringify(package, null, "  ") + "\n", (err) => {
      if (err) {
        console.log(err);
        throw new Error("写入 ./package.json 失败");
      }
    });
  });
}

function updateVersionJson(versionData) {
  writeFile("./src/config/version.json", JSON.stringify(versionData, null, "  ") + "\n", (err) => {
    if (err) {
      console.log(err);
      throw new Error("写入 src/config/version.json 失败");
    }
  });
}

const versionData = getVersionData();
updatePackageJson(versionData.version);
updateVersionJson(versionData);
