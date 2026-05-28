import * as vscode from 'vscode';
import { ExtensionBridge } from '../bridge/ExtensionBridge';
import { getWebviewHtml } from '../utils/getWebviewHtml';

export class MainPanel {
  public static currentPanel: MainPanel | undefined;
  public static readonly viewType = 'vscodeVueTsBridge.mainPanel';

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private readonly bridge: ExtensionBridge;
  private readonly disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri): void {
    const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

    if (MainPanel.currentPanel) {
      MainPanel.currentPanel.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      MainPanel.viewType,
      'Vue TS Bridge',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist', 'webview')]
      }
    );

    MainPanel.currentPanel = new MainPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;
    this.bridge = new ExtensionBridge(panel.webview);

    this.panel.webview.html = getWebviewHtml(this.panel.webview, this.extensionUri);

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.webview.onDidReceiveMessage(
      (message) => {
        void this.bridge.handleMessage(message);
      },
      null,
      this.disposables
    );
  }

  public dispose(): void {
    MainPanel.currentPanel = undefined;

    while (this.disposables.length) {
      const disposable = this.disposables.pop();
      disposable?.dispose();
    }
  }
}
