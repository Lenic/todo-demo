import type { Session } from '@auth/core/types';

import { computed } from 'vue';

import { useState } from '#imports';

type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export const useAuth = () => {
  // 使用 useState 来创建可在组件和插件之间共享的状态
  // session 存储会话数据
  const session = useState<Session | null>('session', () => null);
  // status 存储当前的认证状态
  const status = useState<AuthStatus>('status', () => 'loading');

  // 计算属性，方便判断是否已认证
  const isAuthenticated = computed(() => status.value === 'authenticated');

  // fetchSession 用于从后端获取最新的会话信息
  const fetchSession = async () => {
    try {
      // nuxt 提供的 $fetch 方法，可以自动处理 cookie 和 headers
      const data = await $fetch<Session>('/api/auth/session');
      session.value = data;
      // 如果 session 对象有内容，则用户已认证
      if (Object.keys(data).length > 0) {
        status.value = 'authenticated';
      } else {
        // 否则，未认证
        session.value = null;
        status.value = 'unauthenticated';
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      session.value = null;
      status.value = 'unauthenticated';
    }
  };

  // 登录函数
  // provider: 'github', 'google' etc.
  const signIn = async (provider: string) => {
    // 这里我们直接通过 full page redirect 的方式进行登录
    // 首先获取 CSRF token
    const { csrfToken } = await $fetch<{ csrfToken: string }>('/api/auth/csrf');
    if (!csrfToken) {
      console.error('CSRF token not found');
      return;
    }

    // 构建一个 form 并提交，这是 next-auth/react signIn 的内部实现方式
    const form = document.createElement('form');
    form.action = `/api/auth/signin/${provider}`;
    form.method = 'POST';
    form.style.display = 'none';

    const csrfInput = document.createElement('input');
    csrfInput.name = 'csrfToken';
    csrfInput.value = csrfToken;

    const callbackUrlInput = document.createElement('input');
    callbackUrlInput.name = 'callbackUrl';
    callbackUrlInput.value = window.location.href; // 登录后返回当前页面

    form.appendChild(csrfInput);
    form.appendChild(callbackUrlInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  // 登出函数
  const signOut = async () => {
    // 获取 CSRF token
    const { csrfToken } = await $fetch<{ csrfToken: string }>('/api/auth/csrf');
    if (!csrfToken) {
      console.error('CSRF token not found');
      return;
    }
    // 使用 $fetch 发送 POST 请求到登出端点
    await $fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        csrfToken,
        callbackUrl: window.location.origin, // 登出后返回首页
      }),
    });
    // 登出成功后，清空本地状态并重新获取会话（此时应为空）
    session.value = null;
    status.value = 'unauthenticated';
    // 你也可以选择直接刷新页面
    // window.location.reload();
  };

  return {
    session,
    status,
    isAuthenticated,
    fetchSession,
    signIn,
    signOut,
  };
};
