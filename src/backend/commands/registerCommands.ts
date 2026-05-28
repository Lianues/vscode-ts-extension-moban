import * as vscode from 'vscode';
import { MainPanel } from '../panels/MainPanel';

const COMMANDS = {
  openPanel: 'vscode-vue-ts-bridge-starter.openPanel'
} as const;

export function registerCommands(context: vscode.ExtensionContext): void {
  const openPanelCommand = vscode.commands.registerCommand(COMMANDS.openPanel, () => {
    MainPanel.createOrShow(context.extensionUri);
  });

  context.subscriptions.push(openPanelCommand);
}
