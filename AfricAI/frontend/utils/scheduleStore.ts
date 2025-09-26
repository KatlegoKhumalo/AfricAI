import React from 'react';
import type { LiveSession } from '../types';

export type ScheduledSession = {
	id: string;
	title: string;
	description?: string;
	startAt: string; // ISO
	endAt?: string;  // ISO
	roomId: string;
	tutorId: string;
	createdAt: string; // ISO
};

const STORAGE_KEY = 'africai-schedule';
const CHANNEL_NAME = 'africai-schedule-channel';

type Listener = (sessions: ScheduledSession[]) => void;
const listeners = new Set<Listener>();

function read(): ScheduledSession[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const list: ScheduledSession[] = raw ? JSON.parse(raw) : [];
		return Array.isArray(list) ? list : [];
	} catch {
		return [];
	}
}

function write(next: ScheduledSession[]): void {
	try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
}

function notify(next: ScheduledSession[]): void {
	for (const fn of listeners) fn(next);
	try {
		bc?.postMessage({ type: 'sync', payload: next });
	} catch {}
}

let cache = read();
let bc: BroadcastChannel | null = null;
try {
	bc = new BroadcastChannel(CHANNEL_NAME);
	bc.onmessage = (ev) => {
		const { type, payload } = ev.data || {};
		if (type === 'sync' && Array.isArray(payload)) {
			cache = payload;
			write(cache);
			notify(cache);
		}
	};
} catch {}

export function getSessions(): ScheduledSession[] {
	return [...cache].sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function addSession(input: Omit<ScheduledSession, 'id' | 'createdAt'> & { id?: string }): ScheduledSession {
	const id = input.id || `sess_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
	const session: ScheduledSession = {
		id,
		title: input.title,
		description: input.description,
		startAt: input.startAt,
		endAt: input.endAt,
		roomId: input.roomId,
		tutorId: input.tutorId,
		createdAt: new Date().toISOString(),
	};
	cache = [...cache, session];
	write(cache);
	notify(cache);
	return session;
}

export function updateSession(id: string, updates: Partial<ScheduledSession>): ScheduledSession | null {
	let updated: ScheduledSession | null = null;
	cache = cache.map(s => {
		if (s.id !== id) return s;
		updated = { ...s, ...updates };
		return updated;
	});
	write(cache);
	notify(cache);
	return updated;
}

export function removeSession(id: string): boolean {
	const next = cache.filter(s => s.id !== id);
	const changed = next.length !== cache.length;
	if (changed) {
		cache = next;
		write(cache);
		notify(cache);
	}
	return changed;
}

export function useSchedule(tutorId?: string) {
	const { useEffect, useState, useMemo } = React;
	const [sessions, setSessions] = useState<ScheduledSession[]>(getSessions());

	useEffect(() => {
		const listener: Listener = (next) => setSessions(next.slice());
		listeners.add(listener);
		setSessions(getSessions()); // initial sync
		return () => { listeners.delete(listener); };
	}, []);

    const liveSessions = useMemo(() => {
        const filtered = tutorId ? sessions.filter(s => s.tutorId === tutorId) : sessions;
        return filtered.map(s => ({
            ...s,
            startTime: new Date(s.startAt),
            endTime: s.endAt ? new Date(s.endAt) : new Date(s.startAt),
            bookedStudents: [], // This part might need more info if it's used
            capacity: 0, // This part might need more info if it's used
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Best guess
        } as LiveSession));
    }, [sessions, tutorId]);


	return {
		sessions: liveSessions,
        loading: false, // For simplicity, no loading state for now
	};
}
