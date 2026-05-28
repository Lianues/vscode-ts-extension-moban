import * as vscode from 'vscode';
import type { WorkspaceInfo } from '../../bridge/protocol';

export class WorkspaceService {
  public getInfo(): WorkspaceInfo {
    const folders = vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath) ?? [];

    return {
      name: vscode.workspace.name ?? '未打开工作区',
      folders
    };
  }

  public async showInfo(message: string): Promise<void> {
    await vscode.window.showInformationMessage(message);
  }
}
