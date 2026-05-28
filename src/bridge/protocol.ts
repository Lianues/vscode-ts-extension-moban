export type MessageId = string;

export enum BridgeMessageType {
  Ready = 'bridge:ready',
  Ping = 'bridge:ping',
  Pong = 'bridge:pong',
  GetWorkspaceInfo = 'workspace:getInfo',
  WorkspaceInfo = 'workspace:info',
  ShowInfo = 'vscode:showInfo',
  Error = 'bridge:error'
}

export interface BridgeEnvelope<TType extends string = string, TPayload = unknown> {
  id?: MessageId;
  type: TType;
  payload?: TPayload;
}

export interface WorkspaceInfo {
  name: string;
  folders: string[];
}

export type WebviewToExtensionMessage =
  | BridgeEnvelope<BridgeMessageType.Ready, undefined>
  | BridgeEnvelope<BridgeMessageType.Ping, { text: string; sentAt: number }>
  | BridgeEnvelope<BridgeMessageType.GetWorkspaceInfo, undefined>
  | BridgeEnvelope<BridgeMessageType.ShowInfo, { message: string }>;

export type ExtensionToWebviewMessage =
  | BridgeEnvelope<BridgeMessageType.Pong, { text: string; receivedAt: number }>
  | BridgeEnvelope<BridgeMessageType.WorkspaceInfo, WorkspaceInfo>
  | BridgeEnvelope<BridgeMessageType.Error, { requestType?: string; message: string }>;

export function createMessageId(): MessageId {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
