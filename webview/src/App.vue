<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { WorkspaceInfo } from '@bridge/protocol';
import { bridge, BridgeMessageType } from './bridge/vscodeBridge';
import BridgeStatus from './components/BridgeStatus.vue';

const connected = ref(false);
const workspace = ref<WorkspaceInfo | null>(null);
const lastPong = ref('暂无');
const errorMessage = ref('');
const disposers: Array<() => void> = [];

function requestWorkspaceInfo(): void {
  bridge.request(BridgeMessageType.GetWorkspaceInfo);
}

function sendPing(): void {
  bridge.request(BridgeMessageType.Ping, {
    text: 'Hello from Vue Webview',
    sentAt: Date.now()
  });
}

function showInfoInVsCode(): void {
  bridge.request(BridgeMessageType.ShowInfo, {
    message: '这条消息来自 Vue 前端，通过桥接层发送到 VS Code 后端。'
  });
}

onMounted(() => {
  disposers.push(
    bridge.on(BridgeMessageType.WorkspaceInfo, (message) => {
      connected.value = true;
      workspace.value = message.payload ?? null;
    })
  );

  disposers.push(
    bridge.on(BridgeMessageType.Pong, (message) => {
      connected.value = true;
      const receivedAt = message.payload?.receivedAt ?? Date.now();
      lastPong.value = `${message.payload?.text ?? 'pong'} @ ${new Date(receivedAt).toLocaleTimeString()}`;
    })
  );

  disposers.push(
    bridge.on(BridgeMessageType.Error, (message) => {
      errorMessage.value = message.payload?.message ?? '未知错误';
    })
  );

  bridge.request(BridgeMessageType.Ready);
});

onBeforeUnmount(() => {
  disposers.forEach((dispose) => dispose());
});
</script>

<template>
  <main class="app-shell">
    <section class="hero">
      <p class="eyebrow">VS Code Extension Starter</p>
      <h1>Vue 前端 + TypeScript 后端 + Typed Bridge</h1>
      <p class="description">
        这是一个最小可扩展框架：后端负责 VS Code API 与业务能力，前端负责 Webview UI，桥接层负责双向消息协议。
      </p>
    </section>

    <BridgeStatus :connected="connected" :last-pong="lastPong" />

    <section class="actions">
      <button type="button" @click="requestWorkspaceInfo">获取工作区信息</button>
      <button type="button" @click="sendPing">发送 Ping</button>
      <button type="button" @click="showInfoInVsCode">调用 VS Code 通知</button>
    </section>

    <section class="panel">
      <h2>工作区信息</h2>
      <template v-if="workspace">
        <p><strong>名称：</strong>{{ workspace.name }}</p>
        <ul v-if="workspace.folders.length">
          <li v-for="folder in workspace.folders" :key="folder">{{ folder }}</li>
        </ul>
        <p v-else class="muted">当前没有打开文件夹。</p>
      </template>
      <p v-else class="muted">点击“获取工作区信息”或等待初始化响应。</p>
    </section>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </main>
</template>
