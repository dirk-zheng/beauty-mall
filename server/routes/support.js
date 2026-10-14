const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { detectContactChannels, notifyContactDetailsShared, notifyFirstRobotChat } = require('../services/larkNotifications');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// AI Keyword matching configuration
const keywordRules = [
  {
    keywords: ['skin', 'routine', 'ritual', 'dry', 'oily', 'sensitive', 'hydrate'],
    response: 'Skin Ritual Support ✨\n\nTell us how your skin feels and what finish you enjoy. We can help you layer essence, serum and moisturizer into a simple, flexible ritual.'
  },
  {
    keywords: ['moq', 'minimum order', 'sample', 'quantity', 'private label', 'assortment', 'opening order', 'trial order'],
    response: 'Flexible Beauty Partnerships 📦\n\nStart with hand sanitizer, spray, scented sanitizer, hand wash, cream, lipstick or sunscreen spray, gel, lotion or stick. MOQ, samples, claims and timing are confirmed by formula, testing and packaging.'
  },
  {
    keywords: ['document', 'report', 'customs', 'clearance', 'stability test', 'compatibility test', 'ingredient list', 'compliance'],
    response: 'Product Documents 📄\n\nIngredients, directions, cautions, packaging specifications and available test documents are confirmed by formula and market.'
  },
  {
    keywords: ['price', 'cost', 'how much', 'cheap', 'discount', 'promotion', 'pricing', 'quote'],
    response: 'Beauty Partnership Quotation 💰\n\nShare the formulas, shades, packaging, target market and estimated quantity. Pricing follows the confirmed specification and volume.'
  },
  {
    keywords: ['shipping', 'delivery', 'logistics', 'transport', 'how long', 'freight', 'tracking'],
    response: 'Order & Delivery Support 🚢\n\nShipment planning, cartons, commercial documents and delivery coordination follow the confirmed order. Market compliance responsibilities are agreed before production.'
  },
  {
    keywords: ['return', 'refund', 'warranty', 'quality', 'damage', 'defect', 'exchange', 'inspect', 'inspection', 'qc', 'fill weight', 'shade', 'packaging'],
    response: 'Beauty Quality Support 🛡️\n\nQuality review can cover formula stability, shade, fill weight, packaging compatibility, labels, batch coding and packing.'
  },
  {
    keywords: ['payment', 'pay', 'method', 'wire', 'bank', 'credit', 'terms', 'TT', 'LC'],
    response: 'Order Terms 💳\n\nPayment terms are confirmed clearly in the quotation and proforma invoice for each order. We keep order, QC, loading and document requirements aligned before shipment.'
  }
];

// Default fallback replies
const defaultReplies = [
  'Thank you for contacting Aurelia Pretty. Ask about products, samples, pricing, rituals or private label.',
  'Hello! Share your beauty goals, audience, target price and desired launch window.',
  'Welcome to Aurelia Pretty. How can we help make your next ritual or partnership more luminous?'
];

// Get AI response based on keywords
//根据用户消息关键词生成客服回复
function getAIResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  for (const rule of keywordRules) {
    for (const keyword of rule.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return { reply: rule.response, matchedKeyword: keyword };
      }
    }
  }

  // Random default reply
  const randomReply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  return { reply: randomReply, matchedKeyword: null };
}

// POST /api/support/chat - Send message and get AI reply
//接收客服消息并返回关键词匹配结果
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ code: 400, message: 'Message cannot be empty' });
    }

    const userMessage = message.trim();
    const result = getAIResponse(userMessage);
    const timestamp = new Date().toISOString();
    const messageId = uuidv4();
    const isFirstChat = !db.list('supportMessages').some((item) => item.account === req.user.account);
    await db.upsert('supportMessages', messageId, {
      id: messageId, account: req.user.account, userMessage, aiReply: result.reply,
      matchedKeyword: result.matchedKeyword, createdAt: timestamp,
    });
    await db.recordVisitorEvent({
      visitorId: req.get('x-visitor-id'), account: req.user.account,
      eventType: 'support.chat_message', entityType: 'support_message', entityId: messageId
    });
    const contactChannels = detectContactChannels(userMessage);
    if (contactChannels.length) {
      void notifyContactDetailsShared({
        user: req.user,
        message: userMessage,
        channels: contactChannels,
        timestamp,
      });
    } else if (isFirstChat) {
      void notifyFirstRobotChat({
        user: req.user,
        message: userMessage,
        matchedKeyword: result.matchedKeyword,
        timestamp,
      });
    }

    res.json({
      code: 200,
      data: {
        userMessage,
        aiReply: result.reply,
        matchedKeyword: result.matchedKeyword,
        timestamp
      }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
});

// GET /api/support/faq - Get frequently asked questions
//返回客服模块常见问题列表
router.get('/faq', (req, res) => {
  const faqFile = path.join(__dirname, '..', 'data', 'faqs.json');
  const faqs = JSON.parse(fs.readFileSync(faqFile, 'utf8'));
  res.json({
    code: 200,
    data: faqs.filter((faq) => faq.published !== false)
  });
});

module.exports = router;
