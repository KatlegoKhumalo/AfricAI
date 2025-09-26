import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseSpeechToTextOptions {
	lang?: string;
	interimResults?: boolean;
	onFinalResult?: (text: string) => void;
}

export interface UseSpeechToText {
	isSupported: boolean;
	isRecording: boolean;
	isPermissionDenied: boolean;
	error: string | null;
	start: () => Promise<void>;
	stop: () => void;
	resetError: () => void;
}

export const useSpeechToText = (options: UseSpeechToTextOptions = {}): UseSpeechToText => {
	const { lang = 'en-US', interimResults = false, onFinalResult } = options;

	const recognitionRef = useRef<any | null>(null);
	const [isSupported, setIsSupported] = useState<boolean>(false);
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
		setIsSupported(!!SR);
		if (!SR) return;

		const recognition = new SR();
		recognition.lang = lang;
		recognition.interimResults = interimResults;
		recognition.continuous = false;

		recognition.onstart = () => {
			setIsRecording(true);
			setError(null);
		};
		recognition.onend = () => setIsRecording(false);
		recognition.onerror = (event: any) => {
			if (event?.error === 'not-allowed' || event?.error === 'service-not-allowed') {
				setIsPermissionDenied(true);
			}
			setError(event?.error ? String(event.error) : 'Speech recognition error');
			setIsRecording(false);
		};
		recognition.onresult = (event: any) => {
			const result = event?.results?.[0]?.[0]?.transcript as string | undefined;
			if (result && onFinalResult) onFinalResult(result);
		};

		recognitionRef.current = recognition;

		return () => {
			try { recognition.stop(); } catch {}
			recognitionRef.current = null;
		};
	}, [lang, interimResults, onFinalResult]);

	const ensureMicPermission = useCallback(async () => {
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true });
			setIsPermissionDenied(false);
			return true;
		} catch {
			setIsPermissionDenied(true);
			setError('Microphone permission denied.');
			return false;
		}
	}, []);

	const start = useCallback(async () => {
		if (!isSupported || !recognitionRef.current) return;
		const ok = await ensureMicPermission();
		if (!ok) return;
		try {
			recognitionRef.current.start();
		} catch (e: any) {
			setError(e?.message || 'Failed to start recording');
		}
	}, [ensureMicPermission, isSupported]);

	const stop = useCallback(() => {
		if (!recognitionRef.current) return;
		try { recognitionRef.current.stop(); } catch {}
	}, []);

	const resetError = useCallback(() => setError(null), []);

	return { isSupported, isRecording, isPermissionDenied, error, start, stop, resetError };
};


