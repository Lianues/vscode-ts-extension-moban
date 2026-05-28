import * as vscode from 'vscode';
import {
  BridgeMessageType,
  type ExtensionToWebviewMessage,
  type WebviewToExtensionMessage
} from '../../bridge/protocol';
import { WorkspaceService } from '../services/WorkspaceService';

export class ExtensionBridge {
  private readonly workspaceService = new WorkspaceService();

  public constructor(private readonly webview: vscode.Webview) {}

  public async handleMessage(message: WebviewToExtensionMessage): Promise<void> {
    try {
      switch (message.type) {
        case BridgeMessageType.Ready:
        case BridgeMessageType.GetWorkspaceInfo:
          await this.post({
            id: message.id,
            type: BridgeMessageType.WorkspaceInfo,
            payload: this.workspaceService.getInfo()
          });
          return;

        case BridgeMessageType.Ping:
          await this.post({
            id: message.id,
            type: BridgeMessageType.Pong,
            payload: {
              text: message.payload?.text ?? 'pong',
              receivedAt: Date.now()
            }
          });
          return;

        case BridgeMessageType.ShowInfo:
          await this.workspaceService.showInfo(message.payload?.message ?? 'Hello from Vue Webview');
          return;

        default:
          await this.postError(message, `Unhandled message type: ${(message as { type: string }).type}`);
      }
    } catch (error) {
      await this.postError(message, error);
    }
  }

  public post(message: ExtensionToWebviewMessage): Thenable<boolean> {
    return this.webview.postMessage(message);
  }

  private postError(message: WebviewToExtensionMessage, error: unknown): Thenable<boolean> {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return this.post({
      id: message.id,
      type: BridgeMessageType.Error,
      payload: {
        requestType: message.type,
        message: errorMessage
      }
    });
  }
}
