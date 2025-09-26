import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { SendIcon } from '../components/icons/SendIcon';
import { MicIcon } from '../components/icons/MicIcon';
import { MicOffIcon } from '../components/icons/MicOffIcon';
import { VideoIcon } from '../components/icons/VideoIcon';
import { VideoOffIcon } from '../components/icons/VideoOffIcon';
import { MessageCircleIcon } from '../components/icons/MessageCircleIcon';
import { PhoneOffIcon } from '../components/icons/PhoneOffIcon';

type Presence = { id: string; name: string; avatarUrl?: string; lastSeen: number };

type ChatMsg = { sender: string; text: string; at: number; type: 'chat' | 'system' };

type RoomConfig = { videoId: string; title?: string; description?: string };

const LiveSessionPage: React.FC = () => {
	const { sessionId } = useParams<{ sessionId: string }>();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [connecting, setConnecting] = useState(true);
	const [people, setPeople] = useState<Presence[]>([]);
	const [messages, setMessages] = useState<ChatMsg[]>([]);
	const [typingUsers, setTypingUsers] = useState<Record<string, number>>({});
	const [isChatOpen, setIsChatOpen] = useState(true);
	const [isMicOn, setIsMicOn] = useState(true);
	const [isCamOn, setIsCamOn] = useState(false);
	const [elapsed, setElapsed] = useState(0);
	const [chatMessage, setChatMessage] = useState('');
	const [showConfig, setShowConfig] = useState(false);
	const [config, setConfig] = useState<RoomConfig>({ videoId: new URLSearchParams((typeof window !== 'undefined' ? window.location.search : '') || '').get('v') || 'dQw4w9WgXcQ' });

	const bcRef = useRef<BroadcastChannel | null>(null);
	const lastTypingSentRef = useRef<number>(0);
	const localVideoRef = useRef<HTMLVideoElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);

	const roomTitle = useMemo(() => `Live Session: ${sessionId}`, [sessionId]);
	const channelName = useMemo(() => `live-room-${sessionId}`, [sessionId]);

	useEffect(() => {
		if (!sessionId || !user) return;
		setConnecting(true);
		const channel = new BroadcastChannel(channelName);
		bcRef.current = channel;
		const self: Presence = { id: String(user.id || Math.random()), name: user.name, avatarUrl: (user as any)?.avatarUrl, lastSeen: Date.now() };

		const join = () => channel.postMessage({ type: 'join', payload: self });
		const ping = () => channel.postMessage({ type: 'ping', payload: { id: self.id, ts: Date.now() } });

		channel.onmessage = (ev) => {
			const { type, payload } = ev.data || {};
			if (type === 'join') {
				setPeople(prev => {
					const exists = prev.some(p => p.id === payload.id);
					return exists ? prev.map(p => p.id === payload.id ? { ...p, lastSeen: Date.now(), name: payload.name, avatarUrl: payload.avatarUrl } : p) : [...prev, { ...payload, lastSeen: Date.now() }];
				});
				if (payload.id !== self.id) join();
				setMessages(prev => [...prev, { sender: payload.name, text: 'joined the room', type: 'system', at: Date.now() }]);
			} else if (type === 'leave') {
				setPeople(prev => prev.filter(p => p.id !== payload.id));
				setMessages(prev => [...prev, { sender: payload.name || 'User', text: 'left the room', type: 'system', at: Date.now() }]);
			} else if (type === 'chat') {
				setMessages(prev => [...prev, { sender: payload.sender, text: payload.text, type: 'chat', at: Date.now() }]);
			} else if (type === 'typing') {
				const { id } = payload || {};
				if (!id) return;
				setTypingUsers(prev => ({ ...prev, [id]: Date.now() + 2000 }));
			} else if (type === 'ping') {
				setPeople(prev => prev.map(p => p.id === payload.id ? { ...p, lastSeen: Date.now() } : p));
			}
		};

		setPeople([{ ...self }]);
		join();
		setMessages(prev => [...prev, { sender: self.name, text: 'joined the room', type: 'system', at: Date.now() }]);
		setConnecting(false);

		const hb = window.setInterval(() => {
			ping();
			setPeople(prev => prev.filter(p => Date.now() - p.lastSeen < 15000));
		}, 4000);

		const startedAt = Date.now();
		const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);

		const onUnload = () => channel.postMessage({ type: 'leave', payload: { id: self.id, name: self.name } });
		window.addEventListener('beforeunload', onUnload);
		return () => {
			window.removeEventListener('beforeunload', onUnload);
			channel.postMessage({ type: 'leave', payload: { id: self.id, name: self.name } });
			channel.close();
			window.clearInterval(hb);
			window.clearInterval(timer);
			if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
		};
	}, [channelName, sessionId, user]);

	// Persist chat per session
	useEffect(() => {
		if (!sessionId) return;
		try { localStorage.setItem(`live-room-chat-${sessionId}`, JSON.stringify(messages.slice(-200))); } catch {}
	}, [messages, sessionId]);
	useEffect(() => {
		if (!sessionId) return;
		try {
			const saved = localStorage.getItem(`live-room-chat-${sessionId}`);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) setMessages(parsed);
			}
		} catch {}
	}, [sessionId]);

	// Load saved stage config
	useEffect(() => {
		if (!sessionId) return;
		try {
			const saved = localStorage.getItem(`live-room-config-${sessionId}`);
			if (saved) setConfig(prev => ({ ...prev, ...JSON.parse(saved) }));
		} catch {}
	}, [sessionId]);

	const startCam = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: isMicOn });
			streamRef.current = stream;
			if (localVideoRef.current) localVideoRef.current.srcObject = stream;
			setIsCamOn(true);
		} catch {}
	};
	const stopCam = () => {
		if (!streamRef.current) return;
		streamRef.current.getTracks().forEach(t => t.stop());
		streamRef.current = null;
		setIsCamOn(false);
	};
	const toggleCam = () => (isCamOn ? stopCam() : startCam());
	const toggleMic = () => {
		setIsMicOn(prev => !prev);
		(streamRef.current?.getAudioTracks() || []).forEach(t => (t.enabled = !isMicOn));
	};

	const sendChat = (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || !bcRef.current || !user) return;
		setMessages(prev => [...prev, { sender: user.name, text: trimmed, type: 'chat', at: Date.now() }]);
		bcRef.current.postMessage({ type: 'chat', payload: { sender: user.name, text: trimmed } });
		setChatMessage('');
	};

	const leave = () => navigate(-1);

	return (
		<div className="bg-black text-white h-screen flex flex-col relative">
			{connecting && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
					<div className="text-center">
						<div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
						<div className="text-sm text-gray-300">Connecting to session...</div>
					</div>
				</div>
			)}

			<header className="p-4 flex justify-between items-center bg-black/50">
				<h1 className="text-xl font-semibold flex items-center gap-3">
					{roomTitle}
					<span className="text-xs bg-red-600/30 border border-red-500/50 rounded-full px-2 py-0.5">● LIVE</span>
					<span className="text-xs text-gray-300 tabular-nums">{String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}</span>
				</h1>
				<div className="flex items-center gap-3 text-sm">
					<span>Participants: {people.length}</span>
					<Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(window.location.href)}>Copy Invite</Button>
				</div>
			</header>

			<div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-y-auto">
				<div className="lg:col-span-2 space-y-3">
					<div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 bg-black">
						<iframe
							className="w-full h-full"
							src={`https://www.youtube.com/embed/${config.videoId}?autoplay=1&mute=1`}
							title="Live Session Video"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
						/>
					</div>
					<GlassCard className="p-3">
						<div className="flex items-center gap-3">
							<Button variant="secondary" onClick={toggleMic}>{isMicOn ? <MicIcon /> : <MicOffIcon />}{isMicOn ? ' Mute' : ' Unmute'}</Button>
							<Button variant="secondary" onClick={toggleCam}>{isCamOn ? <VideoOffIcon /> : <VideoIcon />}{isCamOn ? ' Stop Video' : ' Start Video'}</Button>
							<Button variant="secondary" onClick={() => setIsChatOpen(x => !x)}><MessageCircleIcon /> {isChatOpen ? 'Hide Chat' : 'Show Chat'}</Button>
							<Button variant="ghost" className="text-red-400" onClick={leave}><PhoneOffIcon /> Leave</Button>
						</div>
						{isCamOn && (
							<div className="mt-3 w-64 aspect-video rounded-md overflow-hidden border border-white/10 relative">
								<video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
								<div className="absolute bottom-1 left-1 bg-black/60 text-xs px-2 py-0.5 rounded">You</div>
							</div>
						)}
					</GlassCard>
				</div>

				<div className="space-y-4">
					<GlassCard className="p-4">
						<h3 className="text-sm text-gray-400 mb-3">Participants</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{people.map(p => {
								const isTyping = (typingUsers[p.id] || 0) > Date.now();
								return (
									<div key={p.id} className={`flex items-center gap-2 bg-white/5 rounded-md px-2 py-2 ${isTyping ? 'ring-1 ring-green-400' : ''}`}>
										<div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
											{p.avatarUrl ? <img src={p.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
										</div>
										<span className="text-sm truncate" title={p.name}>{p.name}{String(user?.id) === String(p.id) ? ' (You)' : ''}</span>
									</div>
								);
							})}
						</div>
					</GlassCard>

					{isChatOpen && (
						<GlassCard className="p-4 flex flex-col h-[360px]">
							<h3 className="text-sm text-gray-400 mb-2">Chat</h3>
							<div className="flex-1 overflow-y-auto space-y-2 pr-1">
								{messages.map((m, i) => (
									<div key={i} className={`text-sm ${m.type === 'system' ? 'text-gray-400 italic' : ''}`}>
										{m.type === 'system' ? (
											<span>{m.sender} {m.text}</span>
										) : (
											<>
												<span className="font-semibold">{m.sender}</span>: {m.text}
												<span className="text-xs text-gray-500 ml-2">{new Date(m.at).toLocaleTimeString()}</span>
											</>
										)}
									</div>
								))}
								{Object.entries(typingUsers).filter(([, expiry]) => Number(expiry) > Date.now()).length > 0 && (
									<div className="text-xs text-gray-400">Someone is typing...</div>
								)}
							</div>
							<div className="mt-2 flex gap-2">
								<input
									value={chatMessage}
									onChange={(e) => {
										setChatMessage(e.target.value);
										const now = Date.now();
										if (bcRef.current && now - lastTypingSentRef.current > 800) {
											lastTypingSentRef.current = now;
											bcRef.current.postMessage({ type: 'typing', payload: { id: user?.id, name: user?.name } });
										}
									}}
									onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendChat(chatMessage); } }}
									placeholder="Type a message..."
									className="flex-1 bg-white/5 border border-white/10 rounded-md py-2 px-3 text-sm"
								/>
								<Button onClick={() => sendChat(chatMessage)} className="px-3"><SendIcon /></Button>
							</div>
						</GlassCard>
					)}
				</div>
			</div>
		</div>
	);
};

export default LiveSessionPage;

