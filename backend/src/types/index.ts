/**
 * Type definitions for API data from external sources
 */

export type ApiShow = {
  movie_showTime: string;
  screen_name: string;
  is_active: string;
  movie_ID: string;
  movie_title: string;
  movie_rating: string | null;
  movie_length: number | null;
  movie_format: string | null;
  cinema_id: number;
  movie_genere: string | null;
  movie_image_new: string | null;
};

export type SyncShowData = {
  movieID: string;
  cinemaId: number;
  screenName: string;
  showTime: Date;
  title: string;
  rating: string | null;
  length: number | null;
  format: string | null;
  genere: string | null;
  isActive: string | null;
  imageUrl: string | null;
};
