# VSCode Vue TS Bridge Starter

这是一个 VS Code 扩展框架骨架，已按模块拆分为：

- **后端 Extension Host**：TypeScript，负责 VS Code API、命令、业务服务、Webview 生命周期。
- **前端 Webview**：Vue 3 + Vite，负责界面展示与用户交互。
- **桥接层 Bridge**：统一定义前后端消息协议，并封装双向通信。

## 目录结构

```text
.
├── .vscode/
│   ├── launch.json                 # VS Code 扩展调试配置
│   └── tasks.json                  # 构建任务
├── src/
│   ├── extension.ts                # 扩展入口 activate/deactivate
│   ├── backend/
│   │   ├── commands/
│   │   │   └── registerCommands.ts # 命令注册
│   │   ├── panels/
│   │   │   └── MainPanel.ts        # WebviewPanel 生命周期管理
│   │   ├── bridge/
│   │   │   └── ExtensionBridge.ts  # 后端桥接层：接收/分发前端消息
│   │   ├── services/
│   │   │   └── WorkspaceService.ts # 后端业务服务示例
│   │   └── utils/
│   │       └── getWebviewHtml.ts   # Webview HTML、CSP、资源 URI 处理
│   └── bridge/
│       └── protocol.ts             # 前后端共享消息协议与类型
├── webview/
│   ├── index.html                  # Vite 前端入口 HTML
│   └── src/
│       ├── main.ts                 # Vue 入口
│       ├── App.vue                 # 示例页面
│       ├── style.css               # 全局样式
│       ├── bridge/
│       │   └── vscodeBridge.ts     # 前端桥接层：封装 acquireVsCodeApi
│       └── components/
│           └── BridgeStatus.vue    # 示例组件
├── package.json                    # 扩展声明、命令、脚本、依赖
├── tsconfig.json                   # 后端 TS 配置
├── tsconfig.webview.json           # 前端 TS/Vue 类型检查配置
└── vite.config.ts                  # Vue Webview 构建配置
```

## 模块职责划分

### 1. 后端：`src/backend`

- `commands/`：只放 VS Code 命令注册逻辑。
- `panels/`：管理 WebviewPanel 创建、显示、销毁、资源加载。
- `bridge/`：处理来自前端的消息，调用 service，并把结果发回前端。
- `services/`：放具体业务能力，例如读取工作区、文件操作、调用 VS Code API。
- `utils/`：放通用工具，例如 Webview 资源路径、CSP nonce 等。

### 2. 前端：`webview/src`

- `App.vue`：当前示例主界面。
- `components/`：Vue UI 组件。
- `bridge/vscodeBridge.ts`：前端对 VS Code Webview API 的封装。
- `style.css`：全局样式，优先使用 VS Code 主题变量。

### 3. 共享桥接协议：`src/bridge/protocol.ts`

这里统一定义消息类型、payload 类型与消息 ID。新增前后端通信能力时，优先从这里扩展：

1. 在 `BridgeMessageType` 中新增消息类型。
2. 在 `WebviewToExtensionMessage` 或 `ExtensionToWebviewMessage` 中声明 payload 类型。
3. 后端在 `ExtensionBridge.ts` 中处理消息。
4. 前端通过 `bridge.request(...)` 或 `bridge.on(...)` 调用/监听。

## 快速开始

```bash
npm install
npm run build
```

然后在 VS Code 中按 `F5` 启动 Extension Development Host。

在新窗口中打开命令面板，执行：

```text
Vue TS Bridge: Open Panel
```

## 常用脚本

```bash
npm run compile          # 编译扩展后端 TS
npm run build:webview    # 构建 Vue Webview
npm run build            # 构建后端 + 前端
npm run typecheck:webview # 检查 Vue/前端 TS 类型
npm run check            # 后端编译 + 前端类型检查
```

## 已内置的桥接示例

- 前端启动后发送 `bridge:ready`。
- 后端返回 `workspace:info` 工作区信息。
- 前端点击“发送 Ping”，后端返回 `bridge:pong`。
- 前端点击“调用 VS Code 通知”，后端调用 `vscode.window.showInformationMessage`。
