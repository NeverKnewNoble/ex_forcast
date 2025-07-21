import { ref, reactive } from 'vue';
import { 
  createSegmentCategory, 
  getSegmentCategories, 
  deleteSegmentCategory,
  getDefaultSegmentCategories,
  createRoomMarketSegment,
  getRoomMarketSegments,
  deleteRoomMarketSegment,
  getDefaultRoomMarketSegments
} from './data_service.js';
import alertService from '@/components/ui/ui_utility/alertService.js';

// Reactive state for categories and segments
export const marketSegmentCategories = ref([]);
export const marketSegments = ref([]);

// Define the specific order for categories
const CATEGORY_ORDER = [
  "RETAIL",
  "DISCOUNT", 
  "QUALIFIED",
  "NEGOTIATED (CORPORATE)",
  "WHOLESALE",
  "GROUP ROOMS REVENUE",
  "CONTRACT ROOMS REVENUE",
  "OTHER ROOMS REVENUE"
];

// Function to sort categories in the specified order
function sortCategoriesInOrder(categories) {
  const orderedCategories = [];
  const newCategories = [];
  
  // First, add categories in the predefined order
  for (const predefinedCategory of CATEGORY_ORDER) {
    if (categories.includes(predefinedCategory)) {
      orderedCategories.push(predefinedCategory);
    }
  }
  
  // Then, add any new categories after "CONTRACT ROOMS REVENUE"
  for (const category of categories) {
    if (!CATEGORY_ORDER.includes(category)) {
      newCategories.push(category);
    }
  }
  
  // Insert new categories after "CONTRACT ROOMS REVENUE"
  const contractIndex = orderedCategories.indexOf("CONTRACT ROOMS REVENUE");
  if (contractIndex !== -1) {
    orderedCategories.splice(contractIndex + 1, 0, ...newCategories);
  } else {
    // If "CONTRACT ROOMS REVENUE" is not found, append new categories at the end
    orderedCategories.push(...newCategories);
  }
  
  return orderedCategories;
}

// Load categories from localStorage or API
export async function loadCategoriesFromAPI() {
  try {
    const response = await getSegmentCategories();
    if (response && response.data && response.data.message && response.data.message.success) {
      const categories = response.data.message.data || [];
      marketSegmentCategories.value = sortCategoriesInOrder(categories.map(cat => cat.category_name));
      // console.log('Loaded categories from API:', marketSegmentCategories.value);
    } else {
      console.error('Failed to load categories from API:', response);
      // Fallback to localStorage
      loadFromLocalStorage();
    }
  } catch (error) {
    console.error('Error loading categories from API:', error);
    // Fallback to localStorage
    loadFromLocalStorage();
  }
}

// Load segments from localStorage or API
export async function loadSegmentsFromAPI() {
  try {
    const response = await getRoomMarketSegments();
    if (response && response.data && response.data.message && response.data.message.success) {
      const segments = response.data.message.data.room_market_segments || [];
      marketSegments.value = segments.map(seg => ({
        market_segment: seg.market_segment,
        segment_category: seg.segment_category
      }));
      // console.log('Loaded segments from API:', marketSegments.value);
    } else {
      console.error('Failed to load segments from API:', response);
      // Fallback to localStorage
      loadFromLocalStorage();
    }
  } catch (error) {
    console.error('Error loading segments from API:', error);
    // Fallback to localStorage
    loadFromLocalStorage();
  }
}

// Add a new market segment category
export async function addMarketSegmentCategory(categoryName) {
  if (!categoryName || !categoryName.trim()) {
    throw new Error('Category name is required');
  }

  const trimmedName = categoryName.trim();
  
  // Check if category already exists
  if (marketSegmentCategories.value.includes(trimmedName)) {
    throw new Error(`Category "${trimmedName}" already exists`);
  }

  try {
    // Create category in backend
    const response = await createSegmentCategory(trimmedName);
    
    if (response && response.data && response.data.message && response.data.message.success) {
      // Add to local state and maintain order
      marketSegmentCategories.value.push(trimmedName);
      marketSegmentCategories.value = sortCategoriesInOrder(marketSegmentCategories.value);
      
      // Save to localStorage
      saveToLocalStorage();
      
      console.log('Category added successfully:', trimmedName);
      return true;
    } else {
      throw new Error(response?.data?.message?.error || 'Failed to create category');
    }
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}

// Remove a market segment category
export async function removeMarketSegmentCategory(categoryName) {
  if (!categoryName) {
    throw new Error('Category name is required');
  }

  try {
    // Remove from backend
    const response = await deleteSegmentCategory(categoryName);
    
    if (response && response.data && response.data.message && response.data.message.success) {
      // Remove category from local state
      const categoryIndex = marketSegmentCategories.value.indexOf(categoryName);
      if (categoryIndex > -1) {
        marketSegmentCategories.value.splice(categoryIndex, 1);
      }
      
      // Remove all segments belonging to this category
      marketSegments.value = marketSegments.value.filter(
        segment => segment.segment_category !== categoryName
      );
      
      // Save to localStorage
      saveToLocalStorage();
      
      console.log('Category removed successfully:', categoryName);
      return true;
    } else {
      throw new Error(response?.data?.message?.error || 'Failed to delete category');
    }
  } catch (error) {
    console.error('Error removing category:', error);
    throw error;
  }
}

// Add a new market segment
export async function addMarketSegment(segmentName, categoryName) {
  if (!segmentName || !segmentName.trim()) {
    throw new Error('Segment name is required');
  }

  if (!categoryName) {
    throw new Error('Category is required');
  }

  const trimmedName = segmentName.trim();
  
  // Check if segment already exists
  if (marketSegments.value.some(seg => seg.market_segment === trimmedName)) {
    throw new Error(`Segment "${trimmedName}" already exists`);
  }

  // Check if category exists
  if (!marketSegmentCategories.value.includes(categoryName)) {
    throw new Error(`Category "${categoryName}" does not exist`);
  }

  try {
    // Create segment in backend
    const response = await createRoomMarketSegment(trimmedName, categoryName);
    
    if (response && response.data && response.data.message && response.data.message.success) {
      // Add to local state
      marketSegments.value.push({
        market_segment: trimmedName,
        segment_category: categoryName
      });
      
      // Save to localStorage
      saveToLocalStorage();
      
      console.log('Segment added successfully:', trimmedName);
      return true;
    } else {
      throw new Error(response?.data?.message?.error || 'Failed to create segment');
    }
  } catch (error) {
    console.error('Error adding segment:', error);
    throw error;
  }
}

// Remove a market segment
export async function removeMarketSegment(segmentName) {
  if (!segmentName) {
    throw new Error('Segment name is required');
  }

  try {
    // Remove from backend
    const response = await deleteRoomMarketSegment(segmentName);
    
    if (response && response.data && response.data.message && response.data.message.success) {
      // Remove segment from local state
      const segmentIndex = marketSegments.value.findIndex(
        seg => seg.market_segment === segmentName
      );
      if (segmentIndex > -1) {
        marketSegments.value.splice(segmentIndex, 1);
      }
      
      // Save to localStorage
      saveToLocalStorage();
      
      console.log('Segment removed successfully:', segmentName);
      return true;
    } else {
      throw new Error(response?.data?.message?.error || 'Failed to delete segment');
    }
  } catch (error) {
    console.error('Error removing segment:', error);
    throw error;
  }
}

// Reset to default categories and segments from database (module = "Ex Forcast")
export async function resetToDefaults() {
  try {
    console.log('Resetting to defaults from database...');
    
    // Fetch default categories from database
    const categoriesResponse = await getDefaultSegmentCategories();
    if (categoriesResponse && categoriesResponse.data && categoriesResponse.data.message && categoriesResponse.data.message.success) {
      const categories = categoriesResponse.data.message.data || [];
      marketSegmentCategories.value = sortCategoriesInOrder(categories.map(cat => cat.category_name));
      console.log('Loaded default categories from database:', marketSegmentCategories.value);
    } else {
      console.error('Failed to load default categories from database:', categoriesResponse);
      // Fallback to hardcoded defaults
      marketSegmentCategories.value = sortCategoriesInOrder([
        'LEISURE',
        'CORPORATE',
        'GROUP',
        'OTHER ROOMS REVENUE'
      ]);
    }
    
    // Fetch default segments from database
    const segmentsResponse = await getDefaultRoomMarketSegments();
    if (segmentsResponse && segmentsResponse.data && segmentsResponse.data.message && segmentsResponse.data.message.success) {
      const segments = segmentsResponse.data.message.data.room_market_segments || [];
      marketSegments.value = segments.map(seg => ({
        market_segment: seg.market_segment,
        segment_category: seg.segment_category
      }));
      console.log('Loaded default segments from database:', marketSegments.value);
    } else {
      console.error('Failed to load default segments from database:', segmentsResponse);
      // Fallback to hardcoded defaults
      marketSegments.value = [
        { market_segment: 'LEISURE FIT', segment_category: 'LEISURE' },
        { market_segment: 'LEISURE GIT', segment_category: 'LEISURE' },
        { market_segment: 'CORPORATE FIT', segment_category: 'CORPORATE' },
        { market_segment: 'CORPORATE GIT', segment_category: 'CORPORATE' },
        { market_segment: 'GROUP FIT', segment_category: 'GROUP' },
        { market_segment: 'GROUP GIT', segment_category: 'GROUP' },
        { market_segment: 'OTHER ROOMS REVENUE', segment_category: 'OTHER ROOMS REVENUE' }
      ];
    }

    // Save to localStorage
    saveToLocalStorage();
    
    console.log('Reset to defaults completed');
    alertService.success('Reset to defaults completed successfully!');
    
  } catch (error) {
    console.error('Error resetting to defaults:', error);
    // Fallback to hardcoded defaults
    marketSegmentCategories.value = sortCategoriesInOrder([
      'LEISURE',
      'CORPORATE',
      'GROUP',
      'OTHER ROOMS REVENUE'
    ]);

    marketSegments.value = [
      { market_segment: 'LEISURE FIT', segment_category: 'LEISURE' },
      { market_segment: 'LEISURE GIT', segment_category: 'LEISURE' },
      { market_segment: 'CORPORATE FIT', segment_category: 'CORPORATE' },
      { market_segment: 'CORPORATE GIT', segment_category: 'CORPORATE' },
      { market_segment: 'GROUP FIT', segment_category: 'GROUP' },
      { market_segment: 'GROUP GIT', segment_category: 'GROUP' },
      { market_segment: 'OTHER ROOMS REVENUE', segment_category: 'OTHER ROOMS REVENUE' }
    ];

    saveToLocalStorage();
    alertService.error('Error resetting to defaults. Using fallback values.');
  }
}

// Save current state to localStorage
function saveToLocalStorage() {
  try {
    localStorage.setItem('marketSegmentCategories', JSON.stringify(marketSegmentCategories.value));
    localStorage.setItem('marketSegments', JSON.stringify(marketSegments.value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Load state from localStorage
export function loadFromLocalStorage() {
  try {
    const savedCategories = localStorage.getItem('marketSegmentCategories');
    const savedSegments = localStorage.getItem('marketSegments');
    
    if (savedCategories) {
      const categories = JSON.parse(savedCategories);
      marketSegmentCategories.value = sortCategoriesInOrder(categories);
    }
    
    if (savedSegments) {
      marketSegments.value = JSON.parse(savedSegments);
    }
    
    console.log('Loaded from localStorage:', {
      categories: marketSegmentCategories.value,
      segments: marketSegments.value
    });
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    // If there's an error, reset to defaults
    resetToDefaults();
  }
}

// Initialize data - try API first, then fallback to localStorage
export async function initializeData() {
  try {
    // Try to load from API first
    await loadCategoriesFromAPI();
    await loadSegmentsFromAPI();
  } catch (error) {
    console.error('Error loading from API, falling back to localStorage:', error);
    loadFromLocalStorage();
  }
} 