import { reaction } from "mobx";
import { commands, window } from "vscode";
import { store } from "../store";

export function registerStatusBar() {
  const openTodayPageStatusBarItem = window.createStatusBarItem();
  openTodayPageStatusBarItem.command = "davepad.openTodayPage";
  openTodayPageStatusBarItem.text = "$(calendar)";

  const addWikiPageStatusBarItem = window.createStatusBarItem();
  addWikiPageStatusBarItem.command = "davepad.addWikiPage";
  addWikiPageStatusBarItem.text = "$(notebook)";

  reaction(
    () => [store.wiki],
    () => {
      commands.executeCommand("setContext", "davepad:hasWiki", !!store.wiki);

      if (store.wiki) {
        openTodayPageStatusBarItem.tooltip = `GistPad: Open today page (${store.wiki.fullName})`;
        openTodayPageStatusBarItem.show();

        addWikiPageStatusBarItem.tooltip = `GistPad: Add Wiki Page (${store.wiki.fullName})`;
        addWikiPageStatusBarItem.show();
      } else {
        openTodayPageStatusBarItem.hide();
        addWikiPageStatusBarItem.hide();
      }
    }
  );
}