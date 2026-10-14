# Aurelia Beauty OEM/ODM Platform

Aurelia Beauty 是面向美妆品牌、零售商、分销商和电商团队的 B2B OEM/ODM 平台。产品聚焦唇妆、防晒与面部清洁，以产品方案展示、公开询盘、多产品 RFQ 和销售跟进为核心，不提供消费者购物车或在线支付。

## 首发产品

- 唇妆：Designer Lipstick、Traditional Lipsticks、Color Changing Lipsticks
- 防晒：Sunscreen Spray、Sunscreen Gel、Sunscreen Cream & Lotion、Sunscreen Stick
- 洁面：Gel/Cream、Foam、Oil、Micellar Face Cleanser

产品参考来自 Global Cosmetics 的 Sunscreen SPF 与 Lipsticks 目录。正式商用前必须确认图片、商标和产品资料授权，并以最终配方、测试和目标市场审查结果为准。

## 核心流程

1. 访客浏览产品方案并提交公开询盘，或登录后提交多产品 RFQ；
2. 询盘统一进入 /admin/inquiries；
3. 管理员将线索分配给销售负责人；
4. 负责人按 New、Contacted、Qualified、Sampling、Quoted、Won、Lost 推进；
5. 每次跟进记录渠道、结果和下一次跟进时间，形成完整轨迹。

管理员可查看和分配全部线索；销售仅查看和更新分配给自己的线索。

## 主要页面

- /：OEM/ODM 定位与转化入口
- /products：11 个唇妆、防晒与洁面产品方案
- /services/lip-color-development：唇妆开发
- /services/sun-care-development：防晒开发
- /services/quality-and-care：开发、测试与质量流程
- /contact：公开合作询盘
- /quote：登录后的多产品 RFQ
- /admin/inquiries：询盘分配、状态和跟进闭环
- /support/inbox：合作咨询工作台

## 技术栈

React 18、React Router、Vite、Tailwind CSS、Node.js、Express、WebSocket、MySQL、JWT。

## 本地运行

    npm run install:all
    npm run dev:server
    npm run dev

生产构建：

    npm run build
    npm run check:launch

数据库默认名为 aurelia_beauty_b2b，可通过 DB_NAME 覆盖。真实密钥、正式公司主体、域名、隐私条款、图片授权、最终配方、测试证据、标签规范和进口责任需要在上线前确认。