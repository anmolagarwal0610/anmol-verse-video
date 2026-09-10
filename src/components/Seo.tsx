import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://anmol-verse-video.lovable.app';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SeoProps {
  title: string;
  description: string;
  path: string;
}

const Seo = ({ title, description, path }: SeoProps) => {
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
};

export default Seo;
