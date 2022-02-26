import { DocumentSelector } from "vscode";
import { RepoFileSystemProvider, REPO_SCHEME } from "../fileSystem";
import { Repository, Tree } from "../store";
import { sanitizeName } from "../utils";
import { config } from "./config";

export const LINK_SELECTOR: DocumentSelector = [
  {
    scheme: REPO_SCHEME,
    language: "markdown"
  }
];

export const LINK_PREFIX = "[[";
export const LINK_SUFFIX = "]]";
const LINK_PATTERN = /(?:#?\[\[)(?<page>[^\]]+)(?:\]\])|#(?<tag>[^\s]+)/gi;

const WIKI_REPO_PATTERNS = ["wiki", "notes", "obsidian", "journal"];

const WIKI_WORKSPACE_FILES = [
  "davepad.json",
  ".vscode/davepad.json",
  ".vscode/foam.json"
];

const DAILY_PATTERN = /\d{4}-\d{2}-\d{2}/;
export function getPageFilePath(name: string) {
  let fileName = sanitizeName(name).toLocaleLowerCase();
  if (!fileName.endsWith(".md")) {
    fileName += ".md";
  }

  if (DAILY_PATTERN.test(fileName)) {
    const pathPrefix = config.dailyDirectName
      ? `${config.dailyDirectName}/`
      : "";
    return `${pathPrefix}${fileName}`;
  } else {
    return fileName;
  }
}

export interface WikiLink {
  title: string;
  start: number;
  end: number;
  contentStart: number;
  contentEnd: number;
}

export function* findLinks(contents: string): Generator<WikiLink> {
  let match;
  while ((match = LINK_PATTERN.exec(contents))) {
    const title = match.groups!.page || match.groups!.tag;
    const start = match.index;
    const end = start + match[0].length;
    const contentStart = start + match[0].indexOf(title);
    const contentEnd = contentStart + title.length;

    yield {
      title,
      start,
      end,
      contentStart,
      contentEnd
    };
  }
}

export function getTreeItemFromLink(repo: Repository, link: string) {
  return repo.tree!.tree.find(
    (item) =>
      item.displayName?.toLocaleLowerCase() === link.toLocaleLowerCase() ||
      item.path === link ||
      item.path.replace(".md", "") === link
  );
}

export function getUriFromLink(repo: Repository, link: string) {
  const treeItem = getTreeItemFromLink(repo, link);
  return RepoFileSystemProvider.getFileUri(repo.name, treeItem?.path);
}

export function isWiki(repo: Repository, tree?: Tree) {
  const repoTree = tree || repo.tree;
  return (
    WIKI_REPO_PATTERNS.some((pattern) =>
      repo.name.toLocaleLowerCase().includes(pattern)
    ) ||
    !!repoTree?.tree.some((item) => WIKI_WORKSPACE_FILES.includes(item.path))
  );
}
