import { Helmet } from 'react-helmet-async';
import { Card } from '@/types/Card';

interface CharacterMetaTagsProps {
  character: Card;
  url?: string;
}

const CharacterMetaTags = ({ character, url }: CharacterMetaTagsProps) => {
  const currentUrl = url || window.location.href;
  const title = `Character #${character.id} - ${character.goal.split(' ').slice(0, 8).join(' ')}${character.goal.split(' ').length > 8 ? '...' : ''}`;
  const description = character.goal;
  const image = character.image_url;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional meta tags */}
      <meta name="author" content="Lovable Characters Universe" />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default CharacterMetaTags;