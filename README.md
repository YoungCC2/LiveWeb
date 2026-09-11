# LiveWeb
视频直播web版本
项目依赖 AMS 服务器 以及 推送流工具 

推送流工具 推荐 FFmepg

详情 查看 部署文档.txt

## Security setup

- Use Node.js 22.15, Node.js 24, or Node.js 26+ for the `table` demo.
- Copy `.env.example` to an untracked `.env` file and start Node with `node --env-file=.env <script>`, or export the required values in the shell.
- Never commit passwords, API secrets, authorization headers, cookies, or database connection strings.
- The development server listens on `127.0.0.1` by default and should not be exposed to the public internet.
- Credentials that were previously committed must be rotated; removing them from the latest revision does not revoke them or erase Git history.
