import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

export interface Participant {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  avatarId: string;
  avatarEmoji: string;
  currentLevel: number;
  altitude: number;
  xp: number;
  coins: number;
  streak: number;
  maxStreak: number;
  firstTryCount: number;
  isClimbing: boolean;
  avatarState: 'idle' | 'climbing' | 'celebrating' | 'thinking';
  completedAt?: number | null;
  lastActive: number;
  isOnline: boolean;
}

export interface ActivityEvent {
  id: string;
  timestamp: number;
  type: 'join' | 'climb' | 'summit' | 'streak' | 'announcement';
  text: string;
  studentName?: string;
  emoji?: string;
}

export interface Room {
  code: string;
  title: string;
  teacherName: string;
  createdAt: number;
  participants: Record<string, Participant>;
  events: ActivityEvent[];
  announcement: { message: string; timestamp: number } | null;
  isRaceActive: boolean;
}

const rooms: Record<string, Room> = {};

// Clean up inactive rooms after 24 hours
setInterval(() => {
  const now = Date.now();
  for (const code in rooms) {
    if (now - rooms[code].createdAt > 24 * 60 * 60 * 1000) {
      delete rooms[code];
    }
  }
}, 60 * 60 * 1000);

// Helper to generate readable 6-character room codes (e.g. FAR742)
function generateRoomCode(): string {
  const prefix = 'FAR';
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}${num}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json());

  // WebSocket Server
  const wss = new WebSocketServer({ server, path: '/ws' });

  // Map WebSocket to client metadata
  const clientMap = new Map<WebSocket, { roomCode: string; participantId: string; role: 'student' | 'teacher' }>();

  function broadcastToRoom(roomCode: string, payload: any) {
    const json = JSON.stringify(payload);
    for (const [client, meta] of clientMap.entries()) {
      if (meta.roomCode === roomCode && client.readyState === WebSocket.OPEN) {
        client.send(json);
      }
    }
  }

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (messageRaw: string) => {
      try {
        const data = JSON.parse(messageRaw.toString());
        const { type } = data;

        if (type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        if (type === 'join') {
          const { roomCode, participant } = data;
          const codeUpper = String(roomCode || '').toUpperCase().trim();
          let room = rooms[codeUpper];

          if (!room) {
            // If room doesn't exist yet, auto-create if it's the teacher or initialize
            room = {
              code: codeUpper,
              title: 'Turma Farmácia - Matemática Financeira',
              teacherName: participant?.role === 'teacher' ? participant.name : 'Professor',
              createdAt: Date.now(),
              participants: {},
              events: [],
              announcement: null,
              isRaceActive: true,
            };
            rooms[codeUpper] = room;
          }

          const existing = room.participants[participant.id];
          const updatedParticipant: Participant = {
            id: participant.id,
            name: participant.name || 'Aluno Sem Nome',
            role: participant.role || 'student',
            avatarId: participant.avatarId || 'dra-beatriz',
            avatarEmoji: participant.avatarEmoji || '👩‍🔬',
            currentLevel: existing ? existing.currentLevel : (participant.currentLevel || 0),
            altitude: existing ? existing.altitude : (participant.altitude || 0),
            xp: existing ? existing.xp : (participant.xp || 0),
            coins: existing ? existing.coins : (participant.coins || 0),
            streak: existing ? existing.streak : (participant.streak || 0),
            maxStreak: existing ? existing.maxStreak : (participant.maxStreak || 0),
            firstTryCount: existing ? existing.firstTryCount : (participant.firstTryCount || 0),
            isClimbing: false,
            avatarState: 'idle',
            completedAt: existing ? existing.completedAt : null,
            lastActive: Date.now(),
            isOnline: true,
          };

          room.participants[participant.id] = updatedParticipant;
          clientMap.set(ws, { roomCode: codeUpper, participantId: participant.id, role: participant.role || 'student' });

          // Add event if new student
          if (!existing && participant.role === 'student') {
            const joinEvent: ActivityEvent = {
              id: `${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
              type: 'join',
              text: `${updatedParticipant.name} entrou na escalada!`,
              studentName: updatedParticipant.name,
              emoji: updatedParticipant.avatarEmoji,
            };
            room.events = [joinEvent, ...room.events.slice(0, 49)];
          }

          // Reply with current full room state
          ws.send(JSON.stringify({
            type: 'room_state',
            room,
          }));

          // Notify all clients in the room
          broadcastToRoom(codeUpper, {
            type: 'participant_update',
            room,
            participant: updatedParticipant,
          });
        } else if (type === 'progress') {
          const { roomCode, participantId, updates } = data;
          const codeUpper = String(roomCode || '').toUpperCase().trim();
          const room = rooms[codeUpper];
          if (!room || !room.participants[participantId]) return;

          const p = room.participants[participantId];
          const prevLevel = p.currentLevel;

          Object.assign(p, updates, { lastActive: Date.now(), isOnline: true });

          // If reached summit
          if (p.currentLevel >= 12 && (!p.completedAt || prevLevel < 12)) {
            p.completedAt = Date.now();
            const summitEvent: ActivityEvent = {
              id: `${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
              type: 'summit',
              text: `🏆 ${p.name} alcançou o CUME da montanha (3.000m)!`,
              studentName: p.name,
              emoji: '🏆',
            };
            room.events = [summitEvent, ...room.events.slice(0, 49)];
          } else if (p.currentLevel > prevLevel) {
            const climbEvent: ActivityEvent = {
              id: `${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
              type: 'climb',
              text: `${p.name} subiu para o nível ${p.currentLevel} (${p.altitude}m)!`,
              studentName: p.name,
              emoji: p.avatarEmoji,
            };
            room.events = [climbEvent, ...room.events.slice(0, 49)];
          }

          broadcastToRoom(codeUpper, {
            type: 'room_state',
            room,
          });
        } else if (type === 'announcement') {
          const { roomCode, message } = data;
          const codeUpper = String(roomCode || '').toUpperCase().trim();
          const room = rooms[codeUpper];
          if (!room) return;

          room.announcement = {
            message,
            timestamp: Date.now(),
          };

          const annEvent: ActivityEvent = {
            id: `${Date.now()}-${Math.random()}`,
            timestamp: Date.now(),
            type: 'announcement',
            text: `📢 Professor: "${message}"`,
            emoji: '📢',
          };
          room.events = [annEvent, ...room.events.slice(0, 49)];

          broadcastToRoom(codeUpper, {
            type: 'announcement',
            room,
            announcement: room.announcement,
          });
        } else if (type === 'reset_race') {
          const { roomCode } = data;
          const codeUpper = String(roomCode || '').toUpperCase().trim();
          const room = rooms[codeUpper];
          if (!room) return;

          for (const pid in room.participants) {
            const p = room.participants[pid];
            p.currentLevel = 0;
            p.altitude = 0;
            p.xp = 0;
            p.coins = 0;
            p.streak = 0;
            p.maxStreak = 0;
            p.firstTryCount = 0;
            p.avatarState = 'idle';
            p.isClimbing = false;
            p.completedAt = null;
          }

          room.events = [
            {
              id: `${Date.now()}-${Math.random()}`,
              timestamp: Date.now(),
              type: 'announcement',
              text: '🏁 O professor reiniciou a escalada para todos!',
              emoji: '🏁',
            },
            ...room.events.slice(0, 49),
          ];

          broadcastToRoom(codeUpper, {
            type: 'room_state',
            room,
          });
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    });

    ws.on('close', () => {
      const meta = clientMap.get(ws);
      if (meta) {
        const { roomCode, participantId } = meta;
        const room = rooms[roomCode];
        if (room && room.participants[participantId]) {
          room.participants[participantId].isOnline = false;
          room.participants[participantId].lastActive = Date.now();
          broadcastToRoom(roomCode, {
            type: 'participant_status',
            participantId,
            isOnline: false,
            room,
          });
        }
        clientMap.delete(ws);
      }
    });
  });

  // REST API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now(), activeRooms: Object.keys(rooms).length });
  });

  // Create or register a classroom room
  app.post('/api/rooms', (req, res) => {
    const { code, title, teacherName } = req.body || {};
    const roomCode = (code ? String(code).toUpperCase().trim() : generateRoomCode()).replace(/[^A-Z0-9-]/g, '').slice(0, 10);
    
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        code: roomCode,
        title: title || 'Turma Farmácia - Matemática Financeira',
        teacherName: teacherName || 'Prof. Miquéias',
        createdAt: Date.now(),
        participants: {},
        events: [
          {
            id: `${Date.now()}-init`,
            timestamp: Date.now(),
            type: 'announcement',
            text: `Sala de escalada ${roomCode} criada com sucesso!`,
            emoji: '🏔️',
          }
        ],
        announcement: null,
        isRaceActive: true,
      };
    } else if (title || teacherName) {
      if (title) rooms[roomCode].title = title;
      if (teacherName) rooms[roomCode].teacherName = teacherName;
    }

    res.json({
      success: true,
      room: rooms[roomCode],
    });
  });

  // Get current room details
  app.get('/api/rooms/:code', (req, res) => {
    const code = String(req.params.code || '').toUpperCase().trim();
    const room = rooms[code];
    if (!room) {
      res.status(404).json({ error: 'Sala não encontrada' });
      return;
    }
    res.json({ room });
  });

  // Join room via REST (works even if WebSockets are temporarily connecting)
  app.post('/api/rooms/:code/join', (req, res) => {
    const code = String(req.params.code || '').toUpperCase().trim();
    let room = rooms[code];
    const { participant } = req.body || {};

    if (!room) {
      room = {
        code,
        title: 'Turma Farmácia - Matemática Financeira',
        teacherName: participant?.role === 'teacher' ? participant.name : 'Professor',
        createdAt: Date.now(),
        participants: {},
        events: [],
        announcement: null,
        isRaceActive: true,
      };
      rooms[code] = room;
    }

    if (!participant || !participant.id) {
      res.status(400).json({ error: 'Participante inválido' });
      return;
    }

    const existing = room.participants[participant.id];
    const updated: Participant = {
      id: participant.id,
      name: participant.name || 'Aluno',
      role: participant.role || 'student',
      avatarId: participant.avatarId || 'dra-beatriz',
      avatarEmoji: participant.avatarEmoji || '👩‍🔬',
      currentLevel: existing ? existing.currentLevel : (participant.currentLevel || 0),
      altitude: existing ? existing.altitude : (participant.altitude || 0),
      xp: existing ? existing.xp : (participant.xp || 0),
      coins: existing ? existing.coins : (participant.coins || 0),
      streak: existing ? existing.streak : (participant.streak || 0),
      maxStreak: existing ? existing.maxStreak : (participant.maxStreak || 0),
      firstTryCount: existing ? existing.firstTryCount : (participant.firstTryCount || 0),
      isClimbing: false,
      avatarState: 'idle',
      completedAt: existing ? existing.completedAt : null,
      lastActive: Date.now(),
      isOnline: true,
    };

    room.participants[participant.id] = updated;
    broadcastToRoom(code, { type: 'room_state', room });

    res.json({ success: true, room });
  });

  // Post progress update via REST
  app.post('/api/rooms/:code/progress', (req, res) => {
    const code = String(req.params.code || '').toUpperCase().trim();
    const room = rooms[code];
    if (!room) {
      res.status(404).json({ error: 'Sala não encontrada' });
      return;
    }

    const { participantId, updates } = req.body || {};
    if (!participantId || !room.participants[participantId]) {
      res.status(400).json({ error: 'Aluno não encontrado nesta sala' });
      return;
    }

    const p = room.participants[participantId];
    const prevLevel = p.currentLevel;
    Object.assign(p, updates, { lastActive: Date.now(), isOnline: true });

    if (p.currentLevel >= 12 && (!p.completedAt || prevLevel < 12)) {
      p.completedAt = Date.now();
      room.events = [
        {
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          type: 'summit',
          text: `🏆 ${p.name} alcançou o CUME da montanha (3.000m)!`,
          studentName: p.name,
          emoji: '🏆',
        },
        ...room.events.slice(0, 49),
      ];
    } else if (p.currentLevel > prevLevel) {
      room.events = [
        {
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          type: 'climb',
          text: `${p.name} avançou para o nível ${p.currentLevel} (${p.altitude}m)!`,
          studentName: p.name,
          emoji: p.avatarEmoji,
        },
        ...room.events.slice(0, 49),
      ];
    }

    broadcastToRoom(code, { type: 'room_state', room });
    res.json({ success: true, room });
  });

  // Teacher announcement via REST
  app.post('/api/rooms/:code/announcement', (req, res) => {
    const code = String(req.params.code || '').toUpperCase().trim();
    const room = rooms[code];
    if (!room) {
      res.status(404).json({ error: 'Sala não encontrada' });
      return;
    }

    const { message } = req.body || {};
    if (!message) {
      res.status(400).json({ error: 'Mensagem vazia' });
      return;
    }

    room.announcement = {
      message,
      timestamp: Date.now(),
    };

    room.events = [
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        type: 'announcement',
        text: `📢 Professor: "${message}"`,
        emoji: '📢',
      },
      ...room.events.slice(0, 49),
    ];

    broadcastToRoom(code, {
      type: 'announcement',
      room,
      announcement: room.announcement,
    });

    res.json({ success: true, room });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`PharmaFinance Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
