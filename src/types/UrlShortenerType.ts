export class UrlShortenerType{
    constructor (
        public id: number|null, 
        public siteId: number|null, 
        public originalUrl: string|null,
        public hash: string|null,
        public createdAt: Date|null){}
}