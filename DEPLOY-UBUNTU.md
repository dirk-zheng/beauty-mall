# Aurelia Pretty Ubuntu 生产部署指南

本文档以当前仓库中的 Aurelia Pretty B2B 版本为准，适用于将前端、Node.js 服务端、WebSocket 和 MySQL 部署到单台 Ubuntu 服务器。

推荐架构：

```text
浏览器
  |
  | HTTPS / WSS
  v
Nginx :443
  |
  | HTTP / WebSocket（仅服务器本机）
  v
Node.js :3001
  |
  v
MySQL 8 :3306
```

当前服务端在生产模式下会直接托管 `client/dist`，因此前后端可以使用同一个域名，不需要单独部署静态站点。

## 1. 服务器要求

推荐配置：

- Ubuntu 22.04 或 Ubuntu 24.04
- Node.js 20 LTS 或更高版本
- MySQL 8
- Nginx
- 最低 1 GB 内存，建议 2 GB 或以上
- 已解析到服务器公网 IP 的域名

安装基础软件：

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y nginx mysql-server git curl
```

确认版本：

```bash
node --version
npm --version
mysql --version
nginx -v
```

如果 Node.js 低于 20，请先通过 NodeSource、nvm 或服务器管理面板安装 Node.js 20 LTS。

## 2. 上线前安全处理

### 2.1 不要提交生产 `.env`

确认根目录 `.gitignore` 至少包含：

```gitignore
.env
.env.*
!.env.example
```

检查是否误提交了环境文件：

```bash
git ls-files | grep -E '(^|/)\.env($|\.)'
```

输出中只应出现 `.env.example`。如果真实 `.env` 曾上传到远程仓库，应立即更换其中的数据库密码、JWT 密钥和 Webhook 密钥。

### 2.2 配置管理员凭据

当前管理员配置位于：

```text
server/config/admin.js
```

服务每次启动都会创建或同步固定管理员。生产环境必须通过 `ADMIN_ACCOUNT`、`ADMIN_PASSWORD` 和 `ADMIN_NAME` 环境变量提供管理员信息，其中密码至少 12 个字符。

### 2.3 单独创建数据库账号

仓库不提供包含固定密码的建库脚本。生产环境应按照本文第 5 节手动创建权限受限的独立数据库用户，不要复用 MySQL 管理员账号。

## 3. 上传代码

以下示例将项目部署到 `/var/www/aurelia-pretty`：

```bash
sudo mkdir -p /var/www/aurelia-pretty
sudo chown -R "$USER":"$USER" /var/www/aurelia-pretty
git clone <你的仓库地址> /var/www/aurelia-pretty
cd /var/www/aurelia-pretty
```

如果不通过 Git 部署，也可以使用 `rsync`、SFTP 或服务器管理面板上传。不要上传本地的 `node_modules`。

## 4. 安装依赖并构建前端

安装前端依赖：

```bash
cd /var/www/aurelia-pretty/client
npm ci
```

创建前端生产环境文件：

```bash
nano /var/www/aurelia-pretty/client/.env.production.local
```

示例内容：

```dotenv
VITE_SITE_URL=https://example.com
VITE_LEGAL_BUSINESS_NAME=你的公司法定名称
VITE_BUSINESS_POSTAL_ADDRESS=你的业务邮寄地址
VITE_PRIVACY_EMAIL=privacy@example.com
VITE_INQUIRIES_EMAIL=sales@example.com
```

执行构建：

```bash
cd /var/www/aurelia-pretty/client
NODE_ENV=production npm run build
```

该命令会：

- 构建 React/Vite 前端；
- 预渲染公开页面；
- 生成产品和文章详情页；
- 生成 `sitemap.xml`；
- 生成 `robots.txt`；
- 将结果写入 `client/dist`。

确认构建结果：

```bash
test -f /var/www/aurelia-pretty/client/dist/index.html && echo "Frontend build OK"
```

注意：所有 `VITE_` 开头的变量都会进入浏览器构建产物，不能在其中保存密码、Token 或其他秘密。

安装服务端生产依赖：

```bash
cd /var/www/aurelia-pretty/server
npm ci --omit=dev
```

## 5. 配置 MySQL 8

启动 MySQL 并设置开机自启：

```bash
sudo systemctl enable --now mysql
sudo systemctl status mysql
```

进入 MySQL：

```bash
sudo mysql
```

创建 Aurelia Pretty 数据库和专用用户：

```sql
CREATE DATABASE aurelia_pretty_b2b
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

CREATE USER 'aurelia_app'@'localhost'
  IDENTIFIED BY '替换成很长的随机数据库密码';

GRANT ALL PRIVILEGES ON aurelia_pretty_b2b.* TO 'aurelia_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

导入表结构：

```bash
sudo mysql < /var/www/aurelia-pretty/server/sql/schema.sql
```

检查表是否创建成功：

```bash
sudo mysql -e "USE aurelia_pretty_b2b; SHOW TABLES;"
```

应该能看到用户、访客事件、RFQ、询盘、客服会话、即时通信和隐私请求等数据表。

项目使用 `utf8mb4_0900_ai_ci`，因此推荐使用 MySQL 8。旧版 MySQL 或部分 MariaDB 版本可能不支持该排序规则。

## 6. 配置服务端环境变量

从示例文件复制：

```bash
cd /var/www/aurelia-pretty/server
cp .env.example .env
nano .env
```

生产环境参考配置：

```dotenv
HOST=127.0.0.1
PORT=3001
NODE_ENV=production

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=aurelia_pretty_b2b
DB_USER=aurelia_app
DB_PASSWORD=替换成数据库密码
DB_POOL_SIZE=10
DB_AUTO_SCHEMA=false

JWT_SECRET=替换成至少32字符的随机字符串
CORS_ORIGINS=https://example.com,https://www.example.com
TRUST_PROXY=loopback

ADMIN_ACCOUNT=admin
ADMIN_PASSWORD=替换成至少12字符的强管理员密码
ADMIN_NAME=Aurelia Pretty Admin

LEGAL_BUSINESS_NAME="你的公司法定名称"
BUSINESS_POSTAL_ADDRESS="你的业务邮寄地址"
PRIVACY_REQUEST_OWNER=privacy@example.com
INCIDENT_RESPONSE_EMAIL=security@example.com
PRODUCT_COMPLIANCE_OWNER=compliance@example.com

LARK_NOTIFICATIONS_ENABLED=false
LARK_WEBHOOK_URL=
LARK_WEBHOOK_SECRET=
LARK_REQUEST_TIMEOUT_MS=8000
```

生成 JWT 密钥：

```bash
openssl rand -hex 32
```

限制环境文件权限：

```bash
chmod 600 /var/www/aurelia-pretty/server/.env
```

配置说明：

- `HOST=127.0.0.1`：只允许本机 Nginx 访问 Node.js。
- `PORT=3001`：Node.js 内部端口，不应直接暴露公网。
- `DB_AUTO_SCHEMA=false`：生产环境通过明确的 SQL 步骤管理表结构。
- `JWT_SECRET`：必须是唯一且至少 32 个字符的随机值。
- `ADMIN_PASSWORD`：必须至少 12 个字符，且不能使用开发环境默认值。
- `CORS_ORIGINS`：填写实际 HTTPS 域名，多个域名用英文逗号分隔，不能填写 `*`。
- `TRUST_PROXY=loopback`：信任本机 Nginx 转发的客户端地址。
- Lark 未配置时，询盘仍会写入 MySQL，只是不发送群通知。

当前 `npm run check:launch` 会强制检查 Lark Webhook，即使通知被关闭。如果暂时不使用 Lark，应以启动日志和 `/api/health` 为实际运行验证依据；如果需要通过完整上线检查，则必须配置有效的国际版 Lark Webhook 和签名密钥。

## 7. 首次启动测试

直接启动一次服务：

```bash
cd /var/www/aurelia-pretty/server
npm start
```

另开一个 SSH 终端执行：

```bash
curl http://127.0.0.1:3001/api/health
```

正常响应类似：

```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "engine": "mysql",
    "scope": "user-data-only",
    "error": null
  }
}
```

如果测试成功，按 `Ctrl+C` 停止手动运行，然后配置 systemd。

## 8. 使用 systemd 常驻运行

确认 Node.js 路径：

```bash
which node
```

一般返回 `/usr/bin/node`。如果路径不同，应同步修改下面的 `ExecStart`。

确认当前部署用户名：

```bash
whoami
```

创建服务文件：

```bash
sudo nano /etc/systemd/system/aurelia-pretty.service
```

写入以下内容，将 `User=ubuntu` 替换为实际部署用户：

```ini
[Unit]
Description=Aurelia Pretty B2B Server
After=network.target mysql.service
Requires=mysql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/var/www/aurelia-pretty/server
EnvironmentFile=/var/www/aurelia-pretty/server/.env
ExecStart=/usr/bin/node /var/www/aurelia-pretty/server/index.js
Restart=always
RestartSec=5
TimeoutStopSec=20
KillSignal=SIGTERM

[Install]
WantedBy=multi-user.target
```

启动并设置开机自启：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now aurelia-pretty
sudo systemctl status aurelia-pretty
```

查看实时日志：

```bash
sudo journalctl -u aurelia-pretty -f
```

查看最近 100 行日志：

```bash
sudo journalctl -u aurelia-pretty -n 100 --no-pager
```

修改代码或环境变量后重启：

```bash
sudo systemctl restart aurelia-pretty
```

## 9. 配置 Nginx 与 WebSocket

创建站点配置：

```bash
sudo nano /etc/nginx/sites-available/aurelia-pretty
```

写入以下内容，将域名替换为实际域名：

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name example.com www.example.com;

    client_max_body_size 2m;

    location /ws {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/aurelia-pretty /etc/nginx/sites-enabled/aurelia-pretty
sudo nginx -t
sudo systemctl reload nginx
```

如果默认站点产生冲突，可移除默认站点链接：

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

此配置会把普通 HTTP 请求和 `/api` 请求转发给 Express，并为 `/ws` 保留 WebSocket Upgrade 请求头。

## 10. 配置 HTTPS

先在域名服务商处将域名 A 记录指向服务器公网 IP。确认 DNS 生效后安装 Certbot：

```bash
sudo apt install -y certbot python3-certbot-nginx
```

申请证书：

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

检查自动续期：

```bash
sudo certbot renew --dry-run
```

启用 HTTPS 后，前端会自动通过 `wss://example.com/ws` 连接 WebSocket，无需单独配置 WebSocket 地址。

## 11. 配置防火墙

仅开放 SSH、HTTP 和 HTTPS：

```bash
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
sudo ufw status
```

不要向公网开放：

- `3001`：Node.js 内部服务端口
- `3306`：MySQL 数据库端口

## 12. 部署验证

### 12.1 服务状态

```bash
sudo systemctl status aurelia-pretty
sudo systemctl status nginx
sudo systemctl status mysql
```

### 12.2 健康检查

```bash
curl https://example.com/api/health
```

确认返回结果中：

```json
"status": "ok"
```

并且：

```json
"connected": true
```

### 12.3 浏览器检查

逐项验证：

- 首页正常显示，没有空白页。
- `/products` 能显示 8 个产品。
- 产品详情页直接刷新不会返回 Nginx 404。
- `/news-blog/`、`/faq` 和法律页面正常。
- 公开合作询盘能生成参考编号。
- 注册和登录正常。
- 登录后可以添加产品并提交 RFQ。
- 客服浮窗可以收发消息。
- 浏览器开发者工具中 `/ws` 返回 `101 Switching Protocols`。
- Seller/Admin 可以进入 `/support/inbox`。
- Admin 可以进入 `/admin` 和其他管理页面。

## 13. 后续更新流程

先拉取代码：

```bash
cd /var/www/aurelia-pretty
git pull
```

更新服务端依赖：

```bash
cd /var/www/aurelia-pretty/server
npm ci --omit=dev
```

重新构建前端：

```bash
cd /var/www/aurelia-pretty/client
npm ci
NODE_ENV=production npm run build
```

重启服务并验证：

```bash
sudo systemctl restart aurelia-pretty
sudo systemctl status aurelia-pretty
curl https://example.com/api/health
```

只要产品、FAQ、文章或 SEO 配置发生变化，也应重新构建前端，因为预渲染页面和初始数据是在构建阶段生成的。

## 14. 数据持久化注意事项

MySQL 保存：

- 用户和角色
- 用户行为事件
- RFQ 选品清单
- 公开询盘和登录 RFQ
- 客服会话及消息
- 即时通信房间及消息
- 隐私请求

服务器本地 JSON 文件保存：

- `server/data/products.json`
- `server/data/faqs.json`
- `server/data/articles.json`

管理员在后台修改产品、FAQ 或文章时，会直接写入这些 JSON 文件。因此：

- 部署用户必须拥有 `server/data` 的写权限；
- 更新代码前应先备份这些文件；
- 不要用旧版本仓库直接覆盖服务器上的内容文件；
- 当前架构适合单台服务器和单个 Node.js 实例；
- 如果使用 Docker、自动发布或多实例部署，应先将这些内容迁移到数据库或持久卷。

检查权限：

```bash
sudo chown -R ubuntu:ubuntu /var/www/aurelia-pretty/server/data
sudo chmod -R u+rwX,go-rwx /var/www/aurelia-pretty/server/data
```

将 `ubuntu:ubuntu` 替换为 systemd 服务实际使用的用户和用户组。

## 15. 数据库与内容备份

创建备份目录：

```bash
sudo mkdir -p /var/backups/aurelia-pretty
sudo chown "$USER":"$USER" /var/backups/aurelia-pretty
```

备份 MySQL：

```bash
mysqldump -u aurelia_app -p aurelia_pretty_b2b | gzip > /var/backups/aurelia-pretty/mysql-$(date +%F-%H%M%S).sql.gz
```

备份 JSON 内容：

```bash
tar -czf /var/backups/aurelia-pretty/content-$(date +%F-%H%M%S).tar.gz \
  -C /var/www/aurelia-pretty/server data
```

恢复 MySQL 示例：

```bash
gunzip -c /var/backups/aurelia-pretty/备份文件.sql.gz | mysql -u aurelia_app -p aurelia_pretty_b2b
```

生产环境应配置定时备份，并定期验证备份能否成功恢复。

## 16. 常见故障排查

### 16.1 Node.js 服务启动后立即退出

```bash
sudo journalctl -u aurelia-pretty -n 100 --no-pager
```

重点检查：

- `DB_USER` 和 `DB_PASSWORD` 是否正确；
- MySQL 是否启动；
- 数据库表结构是否已经导入；
- `NODE_ENV=production` 时是否配置了 `CORS_ORIGINS`；
- `JWT_SECRET` 是否至少 32 个字符；
- systemd 中的用户、目录和 Node.js 路径是否正确。

### 16.2 Nginx 返回 502

```bash
sudo systemctl status aurelia-pretty
curl http://127.0.0.1:3001/api/health
sudo tail -n 100 /var/log/nginx/error.log
```

如果本机健康检查失败，先修复 Node.js 服务；如果本机成功但 HTTPS 失败，再检查 Nginx 配置。

### 16.3 WebSocket 无法连接

检查：

- Nginx `/ws` 是否设置 `Upgrade` 和 `Connection`；
- 网站是否使用 HTTPS，并通过 `wss://` 连接；
- 实际域名是否包含在 `CORS_ORIGINS` 中；
- 修改 `.env` 后是否重启服务；
- 浏览器控制台是否有 Origin、403 或 CSP 错误。

查看 Nginx 日志：

```bash
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
```

### 16.4 数据库连接失败

测试数据库账号：

```bash
mysql -h 127.0.0.1 -u aurelia_app -p aurelia_pretty_b2b
```

进入后检查：

```sql
SHOW TABLES;
```

### 16.5 页面刷新后返回 404

确认：

- 已执行 `npm run build`；
- `client/dist` 存在；
- `NODE_ENV=production`；
- Nginx 将请求转发给 Node.js，而不是直接用 `try_files` 提供静态目录。

### 16.6 后台修改内容后重启丢失

检查 systemd 用户是否拥有写权限：

```bash
ls -la /var/www/aurelia-pretty/server/data
```

同时确认自动部署流程没有使用仓库里的旧 JSON 文件覆盖服务器内容。

## 17. 正式上线前检查

除了技术部署，还应完成仓库根目录 `PRELAUNCH-US-B2B.md` 中的上线检查，特别是：

- 替换公司名称和地址占位内容；
- 由目标市场律师审核隐私政策和使用条款；
- 核验产品 INCI、宣称、安全、稳定性和包材相容性资料；
- 确认标签、警告、进口商、税费、清关和市场准入责任；
- 为 Admin 和 Seller 增加 MFA；
- 建立日志监控、依赖扫描、加密备份和事故响应流程；
- 用正式产品资料和实物图片复核当前概念内容。

网站中的 MOQ、生产周期和产品信息属于合作参考，正式价格、规格、交期和责任应以书面报价、订单或形式发票为准。
