import type { Tutor, User } from '../types';
import { mockTutors } from '../mockData';

const STORAGE_KEY = 'africai-user-tutors';

function readStoredTutors(): Tutor[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as Tutor[]) : [];
    } catch {
        return [];
    }
}

function writeStoredTutors(tutors: Tutor[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tutors));
    } catch {
        // ignore quota issues silently
    }
}

export function upsertStoredTutor(tutor: Tutor) {
    const list = readStoredTutors();
    const idx = list.findIndex(t => t.id === tutor.id);
    if (idx >= 0) list[idx] = tutor; else list.push(tutor);
    writeStoredTutors(list);
}

export function userToTutor(user: User): Tutor {
    return {
        id: user.id,
        publicId: user.publicId,
        name: user.name,
        avatarUrl: (user as any).avatarUrl,
        title: (user as any).bio || '',
        bio: (user as any).bio || '',
        rating: 0,
        reviews: 0,
        subscription: { status: 'inactive', nextBillingDate: undefined as any, fee: 0 },
        verified: !!(user as any).verified,
        joinDate: (user as any).joinDate || new Date(),
        courses: [],
        schedule: [],
    } as unknown as Tutor;
}

export async function listMergedTutors(currentUser?: User | null): Promise<Tutor[]> {
    const stored = readStoredTutors();
    let backend: Tutor[] = [];
    try {
        const res = await fetch('/api/v1/profile/tutors');
        if (res.ok) backend = await res.json();
    } catch {}

    const ids = new Set<string>();
    const merged: Tutor[] = [];
    for (const t of backend) { if (!ids.has(t.id)) { ids.add(t.id); merged.push(t); } }
    for (const t of stored) { if (!ids.has(t.id)) { ids.add(t.id); merged.push(t); } }
    for (const t of mockTutors) {
        if (!ids.has(t.id)) {
            ids.add(t.id);
            // Ensure mock tutors are complete objects
            merged.push({
                ...t,
                courses: t.courses || [],
                schedule: t.schedule || [],
                subscription: t.subscription || { status: 'active', nextBillingDate: new Date(), fee: 0 },
            } as Tutor);
        }
    }

    // Ensure signed-in tutor appears too (case-insensitive role or boolean flag)
    const role = String((currentUser as any)?.role || '').toLowerCase();
    const isTutor = role === 'tutor' || (currentUser as any)?.isTutor === true;
    if (currentUser && isTutor) {
        const asTutor = userToTutor(currentUser);
        if (!ids.has(asTutor.id)) {
            ids.add(asTutor.id);
            merged.unshift(asTutor);
        }
    }

    // Sanitize all tutors to ensure they have required fields
    return merged.map(t => ({
        ...t,
        courses: t.courses || [],
        schedule: t.schedule || [],
        bio: t.bio || '',
        title: t.title || '',
        rating: t.rating || 0,
        reviews: t.reviews || 0,
    }));
}


