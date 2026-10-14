# 参考产品网址

https://www.global-cosmetics.com/company-information/

# Aurelia Pretty B2B

Aurelia Pretty 是面向零售商、分销商、电商渠道、酒店及品牌合作方的防护类个护产品 B2B 项目。当前目录以 Global Cosmetics 的 Protective Products 页面为产品参考，提供产品展示、样品申请、合作询盘和 RFQ，不提供消费者购物车或在线支付。

## 当前产品

当前分类：protective-products（Protective Products）、lip-care（Lip Care）与 sun-care（Sun Care）。

1. Hand Sanitizer
2. Sanitizer Alcohol Spray
3. Scented Sanitizers
4. Hand Wash
5. Antiseptic Cream
6. Designer Lipstick
7. Traditional Lipsticks
8. Color Changing Lipsticks
9. Sunscreen Spray
10. Sunscreen Gel
11. Sunscreen Cream & Lotion
12. Sunscreen Stick

产品名称与参考图片来自 [Global Cosmetics Protective Products](https://www.global-cosmetics.com/protective-products/)、[Global Cosmetics Sunscreen SPF](https://www.global-cosmetics.com/cosmetic-manufacture-products/oem-odm-skin-care/sunscreen-spf/) 与 [Global Cosmetics Lipsticks](https://www.global-cosmetics.com/cosmetic-manufacture-products/oem-odm-lip-care/lipsticks/)。站内描述、规格摘要、使用提示和质量检查点为本项目重新编写，并对未经最终配方、测试或目标市场确认的功效宣称进行了限定。

产品图片已下载到 client/public/product-images/ 并通过站内路径加载，不再依赖来源站热链。正式商用前仍必须确认图片、商标与产品资料的使用授权；获得正式素材后，建议用已授权的高分辨率图片替换当前目录参考图。

## 项目定位

- 产品：手部消毒凝胶、酒精喷雾、香氛消毒凝胶、洗手液、防护霜、三类唇膏方案，以及防晒喷雾、防晒凝胶、防晒霜/乳和防晒棒
- 客户：Retailer、E-commerce、Distributor、Workplace、Hospitality、Private-label Partner
- 合作方式：批发、定制配方、定制香型、定制包装与 Private Label
- 商务信息：MOQ、交期、配方、测试、标签和宣称均以样品、规格与正式报价为准
- 合规边界：antiseptic、antibacterial、杀菌率及酒精含量等内容必须有针对最终配方与销售市场的资料支持

## 技术栈

- React 18、React Router、Vite、Tailwind CSS
- Node.js、Express、WebSocket
- MySQL 用户与询盘数据 + JSON 内容数据
- JWT、bcryptjs、Nodemailer
- 预渲染、Meta、JSON-LD、sitemap 和 robots

## 本地运行

    npm run install:all
    npm run dev:server
    npm run dev

- 前端：http://localhost:5173/
- 后端：http://localhost:3001/
- WebSocket：ws://localhost:3001/ws

生产构建：

    npm run build
    npm run preview

Ubuntu 部署请参阅 [DEPLOY-UBUNTU.md](./DEPLOY-UBUNTU.md)。

## 主要页面

- /：品牌与 B2B 合作入口
- /products：12 款防护、唇部护理与防晒产品目录
- /products/:slug：图片、描述、规格、MOQ、周期、来源与报价入口
- /services/wholesale-private-label：批发与贴牌合作
- /services/skin-ritual：防护产品组合规划（保留历史 URL）
- /services/quality-and-care：配方、宣称、包材与质量控制
- /news-blog/：防护产品、质量与合作内容
- /faq：产品、定制、MOQ、宣称、图片与交期
- /contact：合作询盘
- /quote：登录后的多产品 RFQ 工作区
- /admin/*：管理后台
- /support/inbox：合作咨询工作台

## 产品数据

server/data/products.json 的主要字段：

- id、name、category
- image、gallery
- description、specs、applications
- sizes、benefit、badge
- moq、leadTime
- sourceUrl、imageSource
- qc
- price、stock：后台兼容字段，公开页面不展示零售价或实时库存

## 数据存储与配置

- MySQL：账号、资料、RFQ、询盘、客服会话和即时沟通
- JSON：产品、FAQ 和文章内容

安装数据库结构并迁移已有用户数据：

    cd server
    npm run db:install
    npm run db:migrate-users

环境变量示例：

    VITE_SITE_URL=https://www.aureliapretty.com
    SITE_URL=https://www.aureliapretty.com
    JWT_SECRET=replace-with-a-strong-secret
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_NAME=your_database_name
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    ADMIN_ACCOUNT=admin
    ADMIN_PASSWORD=replace-with-a-strong-admin-password
    ADMIN_NAME=Aurelia Pretty Admin
    LARK_NOTIFICATIONS_ENABLED=true
    LARK_WEBHOOK_URL=https://open.larksuite.com/open-apis/bot/v2/hook/replace-with-your-webhook-id
    LARK_WEBHOOK_SECRET=replace-with-your-signing-secret

不要提交真实密钥。未配置通知渠道时，询盘仍会保存，但不会发送群通知。

## 上线边界

当前尚未接入 ERP、实时产能、样品付款、PO/PI 签署或在线批发支付。上线前还需确认公司主体、隐私与 B2B 条款、最终配方、成分表、测试证据、标签规范、宣称依据、图片授权、运输限制及进口合规责任。