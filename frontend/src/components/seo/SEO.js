import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Component for dynamic meta tags
 * Updates document title and meta tags based on current route
 */
export function SEO({ title, description, keywords, image, url }) {
  const location = useLocation();
  
  // Default values
  const defaultTitle = 'TaskReward - Complete Tasks, Earn Points, Claim Rewards';
  const defaultDescription = 'Join TaskReward and earn rewards by completing simple tasks. Complete tasks like subscribing, following, and sharing to earn points. Exchange 100 points for real rewards.';
  const defaultKeywords = 'task rewards, earn points, complete tasks, micro tasks, online rewards, task platform, earn money online, rewards platform, task completion, points system';
  const defaultImage = `${window.location.origin}/logo512.png`;
  const defaultUrl = `${window.location.origin}${location.pathname}`;

  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageKeywords = keywords || defaultKeywords;
  const pageImage = image || defaultImage;
  const pageUrl = url || defaultUrl;

  useEffect(() => {
    // Update document title
    document.title = pageTitle;

    // Update or create meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update description
    updateMetaTag('description', pageDescription);
    
    // Update keywords
    updateMetaTag('keywords', pageKeywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', pageTitle, 'property');
    updateMetaTag('og:description', pageDescription, 'property');
    updateMetaTag('og:image', pageImage, 'property');
    updateMetaTag('og:url', pageUrl, 'property');
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', pageImage);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);
  }, [pageTitle, pageDescription, pageKeywords, pageImage, pageUrl, location.pathname]);

  return null; // This component doesn't render anything
}

