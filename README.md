# Auto-JSD
本项目为自动更换JSD加速链接的项目<br>
本意是解决JSD加速被富强或跑路导致图片GG的问题<br>
使用本项目你就可以随时更换JSD镜像链接，只要GG了只需要修改jsd.js内的一个链接就能全部生效<br>
还可以智能优选快的和正常的JSD镜像站，哪怕一个临时掉线or跑路也不会有太大影响<br>
由 Claude 协助完成 可以便捷的部署在Vercel上<br>
可以直接在 jsd.js 文件中的 CDN_URLS 数组里添加或删除 CDN。<br>
支持 自动选择最快的 JSD加速链接<br>
无需外部依赖：使用 Node.js 内置模块，无需额外安装包<br>

# 部署方法
将这些文件放在您的 GitHub 仓库中。<br>
在 Vercel 上连接这个仓库并部署。<br>
部署后，您可以通过 https://your-vercel-domain.vercel.app/jsd/npm/package@version/file 来使用这个服务。<br>

如果您想更新 CDN 列表：<br>

修改 api/jsd.js 文件中的 CDN_URLS 数组。<br>
提交更改到 GitHub。<br>
Vercel 将自动重新部署您的应用。<br>
