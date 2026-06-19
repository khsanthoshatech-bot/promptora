import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());

  // API Routes
  
  // 1. Webhook for Clerk (mock syncing users or manual sync since we don't have ngrok)
  app.post('/api/users/sync', async (req, res) => {
    try {
      const { clerkId, email } = req.body;

      if (!clerkId || !email) {
        return res.status(400).json({
          error: 'Missing clerkId or email'
        });
      }

      const premiumUsers = [
        'khsanthu678@gmail.com',
        'khsanthosha.plans@gmail.com',
        'yournewgmail@gmail.com'
      ];

      let user = await prisma.user.findUnique({
        where: { clerkId }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            clerkId,
            email,
            wallet: premiumUsers.includes(email) ? 100 : 5
          }
        });
      } else if (
        premiumUsers.includes(email) &&
        user.wallet < 100
      ) {
        // Retroactively upgrade users who were added to premium list after account creation
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            wallet: 100
          }
        });
      }

      res.json(user);
    } catch (err: any) {
      console.error('Error syncing user', err);
      res.status(500).json({
        error: err.message
      });
    }
  });

  // 2. Fetch User Profile
  app.get('/api/user/:clerkId', async (req, res) => {
    try {
      let user = await prisma.user.findUnique({ 
        where: { clerkId: req.params.clerkId },
        include: { apiKeys: true }
      });
      
      // Auto-create demo user if missing during demo mode requests
      if (!user && req.params.clerkId === 'mock_user_123') {
        user = await prisma.user.create({
          data: {
            clerkId: 'mock_user_123',
            email: 'demo@nexus.ai',
            wallet: 100
          },
          include: { apiKeys: true }
        });
      }

      if (!user) return res.status(404).json({ error: 'Not found' });
      res.json(user);
    } catch (err: any) {
      console.error('Error in GET /api/user/:clerkId:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Generate API Key
  app.post('/api/keys', async (req, res) => {
    try {
      const { clerkId, name } = req.body;
      let user = await prisma.user.findUnique({ where: { clerkId } });
      
      // Handle demo user on API key creation just in case
      if (!user && clerkId === 'mock_user_123') {
        user = await prisma.user.create({
          data: {
            clerkId: 'mock_user_123',
            email: 'demo@nexus.ai',
            wallet: 100
          }
        });
      }

      if (!user) return res.status(404).json({ error: 'User not found' });

      const rawKey = `sk_${crypto.randomBytes(24).toString('hex')}`;
      const prefix = rawKey.substring(0, 8) + '...' + rawKey.slice(-4);
      const keyHash = await bcrypt.hash(rawKey, 10);

      const newKey = await prisma.apiKey.create({
        data: {
          name,
          prefix,
          keyHash,
          userId: user.id
        }
      });

      res.json({ key: newKey, rawKey }); // Show rawKey ONLY ONCE
    } catch (err: any) {
      console.error('Error in POST /api/keys:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Revoke API Key
  app.delete('/api/keys/:id', async (req, res) => {
    try {
      await prisma.apiKey.delete({ where: { id: req.params.id } });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. Proxy AI Route (Gateway)
  app.post('/api/v1/chat/completions', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
      }
      const rawKey = authHeader.split(' ')[1];

      console.log('====================');
      console.log('AUTH HEADER:', authHeader);
      console.log('RAW KEY:', rawKey);
      console.log('FIRST 12:', rawKey?.slice(0, 12));
      console.log('====================');

      // Very rudimentary lookup, in production you'd use a faster cache (Redis)
      const allKeys = await prisma.apiKey.findMany({ include: { user: true } });
      
      console.log('TOTAL KEYS:', allKeys.length);

      let matchedKey = null;

      for (const k of allKeys) {
        const ok = await bcrypt.compare(rawKey, k.keyHash);

        console.log(
          'CHECK',
          k.prefix,
          '=>',
          ok
        );

        if (ok) {
          matchedKey = k;
          break;
        }
      }

      if (!matchedKey) {
        return res.status(401).json({ error: 'Invalid API Key' });
      }

      const user = matchedKey.user;

      // Check balance
      const ESTIMATED_COST = 0.02;

      if (user.wallet < ESTIMATED_COST) {
        return res.status(402).json({
          error: 'Insufficient balance'
        });
      }

      // Proxy to OpenRouter
      const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
      if (!OPENROUTER_API_KEY) {
        return res.status(500).json({ error: 'Gateway OpenRouter key not configured' });
      }

      const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      });

      const responseData = await orRes.json();
      
      let tokensUsed = responseData.usage?.total_tokens || 0;
      
      // Fixed charge per request
      let cost = 0.02;

      // Update balance & tracking
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: {
            wallet: {
              decrement: cost
            }
          }
        }),
        prisma.apiRequest.create({
          data: {
            apiKeyId: matchedKey.id,
            userId: user.id,
            model: req.body.model || 'unknown',
            tokensUsed,
            cost,
            status: orRes.status
          }
        })
      ]);

      res.status(orRes.status).json(responseData);
      
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'Gateway error' });
    }
  });

  // 6. Analytics Stats
  app.get('/api/stats/:clerkId', async (req, res) => {
    try {
      const user = await prisma.user.findUnique({ where: { clerkId: req.params.clerkId } });
      if (!user) return res.status(404).json({ error: 'Not found' });

      const requests = await prisma.apiRequest.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 100
      });

      const totalRequests = requests.length;
      const totalCost = requests.reduce((acc, r) => acc + r.cost, 0);
      const totalTokens = requests.reduce((acc, r) => acc + r.tokensUsed, 0);

      res.json({ requests, totalRequests, totalCost, totalTokens });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // @ts-ignore
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
