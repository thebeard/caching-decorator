import { BookSummary } from './book-summary.interface';

export interface Book extends BookSummary {
  rating: number;
  synopsis: string;
}
