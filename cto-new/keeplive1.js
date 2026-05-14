// ==UserScript==
// @name         cto.new keepalive (Icon-Based)
// @namespace    http://tampermonkey.net/
// @version      2026-05-14
// @description  基于图标类名的强效保活
// @author       vevc / Gemini
// @match        https://cto.new/business/*/files
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cto.new
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function runTask() {
        console.log(`[Keepalive] 正在检查 - ${new Date().toLocaleTimeString()}`);

        // 1. 优先检测报错页面
        const errorText = ["Something went wrong", "unexpected error", "Try again"];
        const isError = errorText.some(t => document.body.innerText.includes(t));

        if (isError) {
            console.warn("⚠️ 页面已崩溃，正在强制重新加载...");
            window.location.href = window.location.href; // 强制跳转回原地址
            return;
        }

        // 2. 定位刷新按钮 (根据你提供的 svg class)
        // 我们通过寻找包含该 class 的最近的 button 元素来执行点击
        const refreshIcon = document.querySelector('svg.lucide-refresh-cw');
        const refreshBtn = refreshIcon ? refreshIcon.closest('button') : null;

        if (refreshBtn) {
            console.log("✅ 找到刷新按钮，执行点击...");
            refreshBtn.click();
        } else {
            // 3. 兜底逻辑：如果既没报错，也找不到刷新按钮，说明页面还没加载完或结构异常
            console.log("ℹ️ 暂未发现刷新按钮，等待中...");
            
            // 如果超过 1 分钟都找不到按钮，自动刷新一次页面
            if (!window.retryCount) window.retryCount = 0;
            window.retryCount++;
            if (window.retryCount > 2) { 
                location.reload(); 
            }
        }
    }

    // 设置 30 秒执行一次
    const timer = setInterval(runTask, 30000);

    // 每 4 小时深度刷新，清理缓存
    setTimeout(() => {
        location.reload();
    }, 14400000);

})();
