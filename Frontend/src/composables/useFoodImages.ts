import { ref } from 'vue';

/**
 * Composable for handling food images with Foodish API fallbacks
 */
export function useFoodImages() {
  const imageFailed = ref(false);
  
  /**
   * Maps product categories to Foodish API categories
   * @param tagName The product tag name
   * @returns The corresponding Foodish API category
   */
  const getImageCategory = (tagName: string | null): string => {
    if (!tagName) return 'burger';
    
    const tag = tagName.toLowerCase();
    
    // Map product categories to Foodish API categories
    if (tag.includes('pizza')) return 'pizza';
    if (tag.includes('burger')) return 'burger';
    if (tag.includes('pasta')) return 'pasta';
    if (tag.includes('dessert') || tag.includes('kage')) return 'dessert';
    if (tag.includes('rice') || tag.includes('ris')) return 'rice';
    if (tag.includes('chicken') || tag.includes('kylling')) return 'chicken';
    if (tag.includes('vegetable') || tag.includes('grønt')) return 'vegetable';
    if (tag.includes('fish') || tag.includes('fisk')) return 'fish';
    
    // Default to burger if no match
    return 'burger';
  };
  
  /**
   * Generate a random number for the image ID
   * @param max Maximum number (exclusive)
   * @returns A random integer between 1 and max
   */
  const getRandomImageId = (max: number = 15): number => {
    return Math.floor(Math.random() * max) + 1;
  };
  
  /**
   * Generates a Foodish API URL based on category
   * @param category Food category
   * @param maxId Maximum image ID to use
   * @returns A complete Foodish API URL
   */
  const getFoodishUrl = (category: string, maxId: number = 15): string => {
    const imageId = getRandomImageId(maxId);
    return `https://foodish-api.com/images/${category}/${category}${imageId}.jpg`;
  };
  
  /**
   * Generates a food image URL based on product tag
   * @param tagName Product tag name
   * @returns A complete Foodish API URL
   */
  const getFoodImageUrl = (tagName: string | null): string => {
    const category = getImageCategory(tagName);
    return getFoodishUrl(category);
  };
  
  /**
   * Handler for image loading errors
   * @param event The error event
   * @param hideElement Optional - set to true to hide the image element
   */
  const handleImageError = (event: Event, hideElement: boolean = false): void => {
    imageFailed.value = true;
    if (hideElement) {
      const target = event.target as HTMLImageElement;
      target.style.display = 'none';
    }
  };
  
  return {
    imageFailed,
    getImageCategory,
    getRandomImageId,
    getFoodishUrl,
    getFoodImageUrl,
    handleImageError
  };
} 