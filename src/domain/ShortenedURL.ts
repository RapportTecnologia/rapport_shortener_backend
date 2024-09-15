export class ShortenedURL {
    constructor(
      public id: number | null,
      public site_id: number,
      public original_url: string,
      public hash: string,
      public created_at: Date
    ) {}
  
    static generateShortId(): string {
      return Buffer.from(Math.random().toString()).toString('base64').substr(0, 8);
    }
  }
  