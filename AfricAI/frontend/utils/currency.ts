export function formatRand(amount: number | string | null | undefined): string {
	const num = typeof amount === 'string' ? Number(amount.replace(/,/g, '.')) : Number(amount ?? 0);
	const safe = Number.isFinite(num) ? num : 0;
	return `R${safe.toFixed(2)}`;
}


