const fm = require("front-matter");
const path = require("path");
const { resolve } = require("path");
const { writeFile, readdir, readFile } = require("fs").promises;

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

function obsidianLinkToMarkdownLink(match, offset, string) {
  const title = match.replace(/[\[\]]/g, "");
  return `[${title}](/posts/${title
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/[*]/g, "")})`;
}

(async () => {
  let tils = [];

  for await (const f of getFiles(
    "/Users/rickard/Library/Mobile Documents/iCloud~md~obsidian/Documents/notes"
  )) {
    const data = await readFile(f, "utf8");
    const { attributes } = fm(data);

    if (attributes.tags && attributes.tags.includes("til")) {
      tils.push(f);
    }
  }

  for (const til of tils) {
    const filename = path
      .basename(til)
      .toLowerCase()
      .replace(/\s/g, "-")
      .replace(/[*']/g, "");

    const data = await readFile(til, "utf8");
    const content = data.replace(/\[\[(.+)\]\]/gi, obsidianLinkToMarkdownLink);

    await writeFile(`./posts/${filename}`, content);
  }
})();
