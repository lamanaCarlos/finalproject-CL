export interface Certificate {
  _id: string;
  orderId: string;
  artworkId: string;
  artistId: string;
  buyerId: string;
  type: 'authenticity' | 'digital_license';
  terms: string;
  version: number;
  issuedAt: string;
}

