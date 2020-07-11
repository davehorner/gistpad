import * as vscode from "vscode";
import { registerRepoCommands } from "./commands";
import { registerCommentController } from "./comments";
import { registerRepoFileSystemProvider } from "./fileSystem";
import { refreshRepositories } from "./store/actions";
import { initializeStorage } from "./store/storage";
import { registerTourController } from "./tours";
import { registerTreeProvider } from "./tree";

export function registerRepoModule(context: vscode.ExtensionContext) {
  registerRepoCommands(context);

  registerRepoFileSystemProvider();
  registerTreeProvider(context);

  initializeStorage(context);

  registerCommentController(context);
  registerTourController(context);

  //registerWikiController(context);

  refreshRepositories();
}
