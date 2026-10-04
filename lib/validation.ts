export class InputError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function textValue(value: unknown, label: string, max = 200, required = true): string {
  if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) throw new InputError(`Please enter a valid ${label}.`);
  return value.trim();
}
export function normalizePhone(value: unknown): string {
  if (typeof value !== 'string') return '';
  const digits = value.replace(/[০-৯]/g, c => String(c.charCodeAt(0) - 0x09e6)).replace(/\D/g, '');
  return digits.startsWith('880') ? '0' + digits.slice(3) : digits;
}
export function validPhone(value: unknown): string {
  const phone = normalizePhone(value);
  if (!/^01[3-9]\d{8}$/.test(phone)) throw new InputError('Please enter a valid Bangladeshi mobile number (01XXXXXXXXX).');
  return phone;
}
export function numberValue(value: unknown, label: string, integer = false, min = 0): number {
  if ((typeof value !== 'number' && typeof value !== 'string') || value === '') throw new InputError(`Invalid ${label}.`);
  const n = Number(value);
  if (!Number.isFinite(n) || n < min || n > 100000000 || (integer && !Number.isInteger(n))) throw new InputError(`Invalid ${label}.`);
  return n;
}
export function imageUrl(value: unknown): string {
  const url = textValue(value, 'image URL', 2048);
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  try { if (new URL(url).protocol === 'https:') return url; } catch {}
  throw new InputError('Images must use an HTTPS URL.');
}
export function deliveryFee(city: string): number {
  const normalized = city.trim().toLowerCase();
  if (normalized === 'dhaka') return 60;
  if (normalized === 'dhaka suburbs (gazipur/savar/narayanganj)' || normalized === 'suburb') return 100;
  return 120;
}
export function errorResponse(error: unknown, fallback: string): Response {
  if (error instanceof InputError) return Response.json({ error: error.message }, { status: error.status });
  if (error instanceof SyntaxError) return Response.json({ error: 'Invalid request JSON.' }, { status: 400 });
  console.error(fallback, error);
  return Response.json({ error: fallback }, { status: 500 });
}
