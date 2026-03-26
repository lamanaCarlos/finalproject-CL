export interface Review {
  _id: string;
  orderId: string;
  artworkId: string;
  artistId: string;
  buyerId: string | { _id: string; email: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  orderId: string;
  rating: number;
  comment?: string;
}

