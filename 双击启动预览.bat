@echo off
chcp 65001 >nul
title 《鹈鹕测试》本地动画预览服务
cd /d "%~dp0"
echo 正在启动《鹈鹕测试》动画预览...
node tools/serve.mjs
pause
