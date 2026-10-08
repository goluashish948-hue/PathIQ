import { Router, Request, Response } from 'express';
import { prisma, safeJsonParse, safeJsonStringify } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { mentorEngine } from '../engines/mentorEngine.js';

const router = Router();

router.get('/messages', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    let conv = await prisma.mentorConversation.findFirst({
      where: { userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!conv) {
      conv = await prisma.mentorConversation.create({
        data: {
          userId,
          title: 'Career Mentorship',
        },
        include: { messages: true },
      });

      // Add friendly welcoming seed message
      await prisma.mentorMessage.create({
        data: {
          conversationId: conv.id,
          sender: 'mentor',
          text: 'Namaste! Main aapka AI Career Mentor hoon. Aapke target career aur active roadmap ke hisab se main aapko guide karunga. Koi bhi sawaal puchiye—jaise "Mujhe ab kya padhna chahiye?" ya "Mere paas ab sirf 5 hours/week hain."',
          citations: safeJsonStringify({
            why: 'Welcome message and context baseline for student orientation.',
            evidence: ['Career GPS system active', 'Roadmap DAG synchronized'],
            confidenceScore: 0.99,
            confidenceLabel: 'HIGH',
          }),
        },
      });

      conv = await prisma.mentorConversation.findUnique({
        where: { id: conv.id },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
    }

    res.json({ data: conv?.messages || [] });
  } catch (err) {
    next(err);
  }
});

router.post('/send', requireAuth, async (req: Request, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const { text } = req.body;

    let conv = await prisma.mentorConversation.findFirst({ where: { userId } });
    if (!conv) {
      conv = await prisma.mentorConversation.create({ data: { userId, title: 'Career Mentorship' } });
    }

    // Save student message
    await prisma.mentorMessage.create({
      data: {
        conversationId: conv.id,
        sender: 'student',
        text,
      },
    });

    // Generate mentor response
    const mentorReply = await mentorEngine.processMessage(userId, text);

    // Save mentor response
    const replyMsg = await prisma.mentorMessage.create({
      data: {
        conversationId: conv.id,
        sender: 'mentor',
        text: mentorReply.replyText,
        citations: safeJsonStringify(mentorReply.citations),
        proposedAction: mentorReply.proposedAction ? safeJsonStringify(mentorReply.proposedAction) : null,
        actionStatus: mentorReply.proposedAction ? 'PENDING' : null,
      },
    });

    res.json({
      data: {
        id: replyMsg.id,
        sender: 'mentor',
        text: mentorReply.replyText,
        citations: mentorReply.citations,
        proposedAction: mentorReply.proposedAction,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
