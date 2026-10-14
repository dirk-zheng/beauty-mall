# Aurelia Pretty B2B 产品规格

## 1. 产品目标

建立面向零售商、分销商、电商渠道、工作场所、酒店及品牌合作方的防护类个护产品 B2B 网站，以产品评估、样品申请、合作询盘和多 SKU RFQ 为核心转化。

系统不服务消费者直接购买：不显示公开零售价，不提供消费者购物车、促销倒计时、免邮或零售退货承诺。

## 2. 目录范围

合法分类为：protective-products、lip-care 与 sun-care。

当前固定产品为 12 款：

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

产品名称、目录结构和参考图片基于 Global Cosmetics Protective Products、Sunscreen SPF 与 Lipsticks 页面；描述为项目原创改写。每条产品数据保留 sourceUrl 与 imageSource 以便追溯。

## 3. 商品模型

公开商品页展示名称、品类、来源参考图、产品说明、产品定位、规格或包装范围、使用提示、参考 MOQ、待确认交期以及报价和样品入口。

核心字段：

- 标识：id、name、category
- 展示：image、gallery、description、benefit、badge
- 规格：specs、applications、sizes、qc
- 商务：moq、leadTime
- 追溯：sourceUrl、imageSource
- 兼容：price、stock

price 和 stock 仅作为后台兼容字段；公开页面与 Product JSON-LD 不输出未经确认的价格 Offer。

## 4. 图片与内容策略

- 当前产品图片保存在 client/public/product-images/，产品数据使用站内路径；
- 详情页显示来源链接及商用授权提醒；
- 正式上线前必须取得图片、商标与内容使用许可，或替换为自有/已授权素材；
- 当前目录图仅作来源产品参考，授权确认后应替换为正式高分辨率素材，并可迁移到自有对象存储或 CDN；
- 不逐字复制来源站描述，所有站内描述与规格摘要采用重新编写的表达。

## 5. 宣称与合规

- antiseptic、antibacterial、杀菌率、酒精含量等宣称必须对应最终配方、测试证据和目标市场法规；
- Hand Wash 来源页存在需要进一步核实的酒精含量表述，项目不直接采纳该项宣称；
- MOQ 和周期使用 Typical、Confirm、Subject to approval 等限定语；
- INCI、标签语言、过敏原、危险品运输、包装相容性和市场准入责任需在订单中确认；
- 使用说明仅作目录级参考，最终以获批标签为准。

## 6. 转化流程

### 公共合作询盘

无需登录即可提交联系人、公司、商务邮箱、业务类型、销售渠道、目标市场、感兴趣产品、预计数量、配方或香型、包装要求、目标交付窗口和补充说明。

表单只创建合作线索，不创建 PO，也不保证价格、产能、合规状态或交期。

### 登录 RFQ

1. 合作方登录；
2. 从商品详情添加多个产品；
3. 填写各产品参考数量；
4. 补充市场、包装、标签、配方、香型、宣称、合规与交付要求；
5. 提交 RFQ，由商务团队确认样品、测试与报价。

## 7. 内容体系

- Protective Products：5 款产品目录及详情
- Wholesale & Private Label：合作、打样、包材、订单与交付
- Protective-Care Range：使用场景与产品组合
- Formula, Claims & Quality：稳定性、包材相容性、标签、批次与宣称
- Journal：产品格式、质量审批与渠道合作内容
- FAQ：产品、定制、MOQ、宣称、图片授权与生产周期

## 8. 验收标准

- Collection 呈现 12 款产品与 protective-products、lip-care、sun-care 三个分类；
- 前端筛选、后台新增/编辑及 WebSocket 商品校验接受新分类；
- 每款产品展示对应来源图片、标题、原创描述与来源链接；
- 商品卡与详情展示规格、定位、MOQ、周期和合作 CTA；
- SEO 结构化数据正确处理远程 HTTPS 图片；
- FAQ、文章、服务与客服知识不再围绕旧护肤、彩妆和香氛目录；
- README 明确第三方图片授权与远程依赖风险；
- 构建、预渲染、JSON 和服务端语法检查通过。