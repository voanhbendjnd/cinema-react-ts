import { Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { MovieSuggestion } from '@/types/chat.types';
import { generateMovieSlug } from '@/utils/generate.slug';

const { Text } = Typography;

interface MovieSuggestionCardProps {
  movie: MovieSuggestion;
}

const MovieSuggestionCard = ({ movie }: MovieSuggestionCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      size="small"
      hoverable
      className="cinemate-movie-card"
      onClick={() => navigate(generateMovieSlug(movie.title, movie.id))}
    >
      <Text strong className="cinemate-movie-card__title">
        {movie.title}
      </Text>
      <br />
      <Text type="secondary" className="cinemate-movie-card__genre">
        {movie.genre}
      </Text>
    </Card>
  );
};

export default MovieSuggestionCard;
