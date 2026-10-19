import { EMPTY_CONTENT, type ContentSnapshot } from './resolve';

export class PublicationCache {
  private last?: ContentSnapshot;
  private pending?: Promise<ContentSnapshot>;
  private readonly contractHash: string;

  constructor(contractHash: string) { this.contractHash = contractHash; }

  accepts(value: unknown): value is ContentSnapshot {
    return !!value && typeof value === 'object' && 'schemaVersion' in value && value.schemaVersion === 2 && 'contractHash' in value && value.contractHash === this.contractHash && 'documents' in value && !!value.documents && typeof value.documents === 'object' && !Array.isArray(value.documents);
  }

  async load(fetchPublished: () => Promise<unknown>, read: () => Promise<unknown>, write: (snapshot: ContentSnapshot) => Promise<void>, report: (error: unknown) => void): Promise<ContentSnapshot> {
    if (this.pending) return this.pending;
    this.pending = (async () => {
      try {
        const snapshot = await fetchPublished();
        if (!this.accepts(snapshot)) throw new Error('FE và backend chưa cùng phiên bản hợp đồng CMS');
        this.last = snapshot;
        try { await write(snapshot); } catch (error) { report(error); }
        return snapshot;
      } catch (error) {
        report(error);
        if (this.last) return this.last;
        try { const saved = await read(); if (this.accepts(saved)) { this.last = saved; return saved; } } catch { }
        return EMPTY_CONTENT;
      }
    })();
    try { return await this.pending; } finally { this.pending = undefined; }
  }
}
