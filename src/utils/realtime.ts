import { Participant, RoomState, ActivityEvent } from '../types';

type MessageHandler = (room: RoomState) => void;
type AnnouncementHandler = (announcement: { message: string; timestamp: number }) => void;

class RealtimeManager {
  private ws: WebSocket | null = null;
  private currentRoomCode: string | null = null;
  private currentParticipant: Participant | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private announcementHandlers: Set<AnnouncementHandler> = new Set();
  private reconnectTimer: any = null;
  private pingInterval: any = null;
  private isConnecting: boolean = false;

  public getOrCreateStudentId(): string {
    const key = 'pfq_student_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = 'aluno_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem(key, id);
    }
    return id;
  }

  public getSavedStudentName(): string {
    return localStorage.getItem('pfq_student_name') || '';
  }

  public saveStudentName(name: string) {
    localStorage.setItem('pfq_student_name', name);
  }

  public subscribe(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public onRoomUpdate(handler: MessageHandler): () => void {
    return this.subscribe(handler);
  }

  public leaveRoom() {
    this.disconnect();
  }

  public onAnnouncement(handler: AnnouncementHandler): () => void {
    this.announcementHandlers.add(handler);
    return () => this.announcementHandlers.delete(handler);
  }

  public async fetchRoom(roomCode: string): Promise<RoomState | null> {
    try {
      const res = await fetch(`/api/rooms/${roomCode.toUpperCase().trim()}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.room || null;
    } catch (e) {
      console.error('Error fetching room:', e);
      return null;
    }
  }

  public async createRoom(title: string, teacherName: string, customCode?: string): Promise<RoomState | null> {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, teacherName, code: customCode }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.room || null;
    } catch (e) {
      console.error('Error creating room:', e);
      return null;
    }
  }

  public connect(roomCode: string, participant: Participant) {
    this.currentRoomCode = roomCode.toUpperCase().trim();
    this.currentParticipant = participant;

    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Also send an initial REST join as a guarantee
    fetch(`/api/rooms/${this.currentRoomCode}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.room) {
          this.notifyHandlers(data.room);
        }
      })
      .catch(() => {});

    this.initWebSocket();
  }

  private initWebSocket() {
    if (!this.currentRoomCode || !this.currentParticipant) return;
    if (this.isConnecting) return;

    this.isConnecting = true;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        this.isConnecting = false;
        // Join message
        ws.send(JSON.stringify({
          type: 'join',
          roomCode: this.currentRoomCode,
          participant: this.currentParticipant,
        }));

        // Heartbeat
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'room_state' || data.type === 'participant_update' || data.type === 'participant_status') {
            if (data.room) {
              this.notifyHandlers(data.room);
            }
          } else if (data.type === 'announcement') {
            if (data.room) {
              this.notifyHandlers(data.room);
            }
            if (data.announcement) {
              this.announcementHandlers.forEach(h => h(data.announcement));
            }
          }
        } catch (err) {
          console.error('Error handling ws message:', err);
        }
      };

      ws.onclose = () => {
        this.isConnecting = false;
        if (this.pingInterval) clearInterval(this.pingInterval);
        // Attempt reconnection after 3 seconds if room is still active
        if (this.currentRoomCode && this.currentParticipant) {
          this.reconnectTimer = setTimeout(() => {
            this.initWebSocket();
          }, 3000);
        }
      };

      ws.onerror = () => {
        this.isConnecting = false;
        try {
          ws.close();
        } catch {}
      };
    } catch (e) {
      this.isConnecting = false;
      console.warn('WebSocket connection not ready, will retry:', e);
      this.reconnectTimer = setTimeout(() => {
        this.initWebSocket();
      }, 4000);
    }
  }

  public updateProgress(updates: Partial<Participant>) {
    if (!this.currentRoomCode || !this.currentParticipant) return;

    // Local optimistic update
    this.currentParticipant = {
      ...this.currentParticipant,
      ...updates,
    };

    const payload = {
      type: 'progress',
      roomCode: this.currentRoomCode,
      participantId: this.currentParticipant.id,
      updates,
    };

    // Send via WebSocket if ready
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }

    // Always mirror to REST for resilience
    fetch(`/api/rooms/${this.currentRoomCode}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantId: this.currentParticipant.id,
        updates,
      }),
    }).catch(() => {});
  }

  public sendAnnouncement(message: string) {
    if (!this.currentRoomCode) return;

    const payload = {
      type: 'announcement',
      roomCode: this.currentRoomCode,
      message,
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }

    fetch(`/api/rooms/${this.currentRoomCode}/announcement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    }).catch(() => {});
  }

  public resetRace() {
    if (!this.currentRoomCode) return;
    const payload = {
      type: 'reset_race',
      roomCode: this.currentRoomCode,
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  public disconnect() {
    this.currentRoomCode = null;
    this.currentParticipant = null;
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
  }

  private notifyHandlers(room: RoomState) {
    this.messageHandlers.forEach(h => h(room));
  }
}

export const realtimeManager = new RealtimeManager();
