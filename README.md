# Aurelia Ingredients B2B

Aurelia Ingredients 是面向化妆品配方师、品牌、生产商、实验室和原料分销商的美妆原料 B2B 项目。网站围绕原料检索、技术资料、评估样品、商业包装和 RFQ 展开，不提供消费者购物或医疗建议。

## 业务范围

- 功效原料：神经酰胺复合物、多分子透明质酸、烟酰胺等
- 植物来源原料：积雪草提取物、天然红没药醇等
- 功能性原料：角鲨烷、乳化剂、二氧化硅微球等
- 技术信息：INCI、建议添加量、溶解性、应用与处理、TDS、SDS、COA
- 商业信息：评估样品、包装规格、MOQ、交期和批次追溯

## 技术栈与运行

- React 18、React Router、Vite、Tailwind CSS
- Node.js、Express、WebSocket
- MySQL 用户与询价数据，JSON 原料、FAQ 与文章数据
- JWT、预渲染、Meta、JSON-LD、sitemap 和 robots

```bash
npm run install:all
npm run dev:server
npm run dev
```

- 前端：`http://localhost:5173/`
- 后端：`http://localhost:3001/`
- WebSocket：`ws://localhost:3001/ws`

生产构建：

```bash
npm run build
npm run preview
```

## 主要页面

- `/`：美妆原料定位与重点原料
- `/products`：功效原料、植物提取物和功能性原料组合
- `/products/:slug`：INCI、建议添加量、溶解性、技术亮点、包装和 MOQ
- `/services/formulation-support`：选料与配方技术支持
- `/services/sampling-and-supply`：评估样品与商业供应
- `/services/quality-documentation`：规格、TDS、SDS、COA 与变更控制
- `/news-blog/`：配方与原料技术资料库
- `/faq`：样品、文件、MOQ、交期与质量常见问题
- `/contact`：公开原料询样和询价
- `/quote`：登录后的多原料 RFQ 工作区
- `/admin/*`：原料、用户、技术文章与 FAQ 管理
- `/support/inbox`：原料技术支持工作台

## 原料数据

`server/data/products.json` 主要字段：

- `id`、`name`、`category`
- `inci`、`recommendedUse`、`solubility`
- `description`、`specs`、`applications`
- `image`、`gallery`
- `sizes`、`benefit`、`badge`
- `moq`、`leadTime`

`price` 和 `stock` 为历史兼容字段，公开页面不展示未经确认的价格、Offer 或实时库存。

原料视觉位于 `client/public/ingredients/`。上线前需核对每个原料的真实外观、规格、批次文件、处理建议和市场适用性。

## 环境配置

生产环境必须配置站点 URL、JWT、数据库和通知渠道。现有 `aureliabeauty.com` 域名及邮箱可继续作为基础设施地址，展示品牌统一为 Aurelia Ingredients。不要提交真实密钥。

## 上线边界

网站的建议添加量和应用说明仅作为配方评估起点。配方师或成品责任方必须完成最终配方的安全、稳定性、防腐、功效、包装相容性、宣称和目标市场合规验证。
