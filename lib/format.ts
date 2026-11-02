export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1000; // Decimal units standard for storage drives
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i >= sizes.length) return `${(bytes / Math.pow(k, sizes.length - 1)).toFixed(dm)} ${sizes[sizes.length - 1]}`;

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatPercent(value: number): string {
  if (isNaN(value)) return '0%';
  return `${Math.round(value)}%`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}

export function truncateMiddle(text: string, startChars = 8, endChars = 6): string {
  if (!text || text.length <= startChars + endChars) return text;
  return `${text.substring(0, startChars)}...${text.substring(text.length - endChars)}`;
}
