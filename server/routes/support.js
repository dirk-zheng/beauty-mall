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
  { keywords: ['lipstick', 'lip color', 'shade', 'matte', 'satin', 'payoff', 'wear'], response: 'Lip Makeup Development\n\nShare your target consumer, finish, shade references, payoff, wear, packaging, price position and quantity. We can turn that into a sample brief.' },
  { keywords: ['sunscreen', 'spf', 'sun care', 'spray', 'gel', 'lotion', 'sun stick', 'uv'], response: 'Sun Care Development\n\nChoose spray, gel, cream, lotion or stick, then share the target market, texture, SPF direction, supporting claims, packaging and quantity.' },
  { keywords: ['moq', 'minimum order', 'sample', 'quantity', 'private label', 'opening order', 'trial order'], response: 'OEM/ODM Commercial Scope\n\nCurrent reference programs generally start around 10,000 units per order, with 5,000 per color or formulation type. Final MOQ follows the formula and packaging brief.' },
  { keywords: ['document', 'report', 'customs', 'clearance', 'stability test', 'compatibility test', 'ingredient list', 'compliance'], response: 'Testing & Documents\n\nIngredients, stability, compatibility, claim evidence, directions, cautions and available market documents are confirmed for the final formula and pack.' },
  { keywords: ['price', 'cost', 'how much', 'pricing', 'quote'], response: 'OEM/ODM Quotation\n\nPricing depends on formula, shade or SPF direction, component, decoration, packaging and volume. Share the brief for a qualified quotation.' },
  { keywords: ['shipping', 'delivery', 'logistics', 'transport', 'how long', 'freight', 'tracking'], response: 'Production & Delivery\n\nTiming and shipment planning follow formula, testing, packaging and artwork approval. Delivery terms are confirmed in the quotation and order documents.' },
  { keywords: ['quality', 'damage', 'defect', 'inspect', 'inspection', 'qc', 'fill weight', 'packaging'], response: 'Quality Review\n\nQuality checkpoints can cover formula stability, shade or SPF evidence, fill weight, packaging compatibility, labels, coding and packing.' }
];
// Default fallback replies
const defaultReplies = [
  'Tell us whether you are developing lip makeup or sun care, plus your market, quantity, target price and launch timing.',
  'Share your product brief and we will help define the next development step.',
  'Ask about formats, customization, samples, testing, MOQ or quotation.'
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
