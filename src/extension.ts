import * as vscode from 'vscode';
import { registerCommands } from './backend/commands/registerCommands';
import { registerSidebarEntryView } from './backend/views/SidebarEntryView';

export function activate(context: vscode.ExtensionContext): void {
  registerCommands(context);
  registerSidebarEntryView(context);

  console.log('VSCode Vue TS Bridge Starter is active.');
}

export function deactivate(): void {
  // 预留：在这里释放全局资源、关闭连接或清理缓存。
}
