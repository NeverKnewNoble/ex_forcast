import { selectedProject } from '@/components/utility/dashboard/projectService.js';

// Custom API call to fetch Room Revenue Information from our Frappe backend
export async function getRoomRevenueList() {
  try {
    // Get the currently selected project
    const currentProject = selectedProject.value
    
    // console.log('getRoomRevenueList called with project:', currentProject?.project_name);
    
    if (!currentProject) {
      // Return special status to indicate no project selected
      return { 
        status: 'no_project_selected',
        message: 'No project selected'
      };
    }

    // Load room revenue data filtered by project
    const response = await fetch(`/api/v2/method/ex_forcast.api.room_revenue_display.room_revenue_display?project=${encodeURIComponent(currentProject.project_name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    // console.log('Room revenue API response for project:', currentProject.project_name, data);
    
    // Check if the project has any data
    const roomRevenueData = data.data || {};
    const hasData = Object.keys(roomRevenueData).length > 0;
    
    if (!hasData) {
      return {
        status: 'no_data',
        message: `No room revenue data found for project: ${currentProject.project_name}`,
        project: currentProject.project_name
      };
    }
    
    return roomRevenueData;
  } catch (error) {
    console.error('Error fetching room revenue data:', error);
    return { 
      status: 'error',
      message: 'Failed to load room revenue data'
    };
  }
}

// API call to create a new Segment Category
export async function createSegmentCategory(categoryName) {
  try {
    console.log('Creating segment category:', categoryName);
    
    const params = new URLSearchParams();
    params.append('category_name', categoryName);
    
    const response = await fetch('/api/v2/method/ex_forcast.api.segment_category_api.create_segment_category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Segment Category creation response:', data);
    return data;
  } catch (error) {
    console.error('Error creating segment category:', error);
    throw error;
  }
}

// API call to fetch all Segment Categories
export async function getSegmentCategories() {
  try {
    const response = await fetch('/api/v2/method/ex_forcast.api.segment_category_api.get_segment_categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    // console.log('Segment Categories response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching segment categories:', error);
    throw error;
  }
}

// API call to fetch default Segment Categories (module = "Ex Forcast")
export async function getDefaultSegmentCategories() {
  try {
    const response = await fetch('/api/v2/method/ex_forcast.api.segment_category_api.get_default_segment_categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Default Segment Categories response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching default segment categories:', error);
    throw error;
  }
}

// API call to delete a Segment Category
export async function deleteSegmentCategory(categoryName) {
  try {
    console.log('Deleting segment category:', categoryName);
    
    const params = new URLSearchParams();
    params.append('category_name', categoryName);
    
    const response = await fetch('/api/v2/method/ex_forcast.api.segment_category_api.delete_segment_category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Segment Category deletion response:', data);
    return data;
  } catch (error) {
    console.error('Error deleting segment category:', error);
    throw error;
  }
}

// Custom API call to save Room Revenue changes
export async function saveRoomRevenueChanges(changes) {
  try {
    // Get the currently selected project
    const currentProject = selectedProject.value
    
    if (!currentProject) {
      throw new Error('No project selected. Please select a project first.');
    }
    
    console.log('Sending room revenue changes to API for project:', currentProject.project_name, changes)
    
    // Try URLSearchParams approach for Frappe API
    const params = new URLSearchParams()
    params.append('changes', JSON.stringify(changes))
    params.append('project', currentProject.project_name)
    
    const response = await fetch('/api/v2/method/ex_forcast.api.room_revenue_display.upsert_room_revenue_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    console.log('Room revenue API Response status:', response.status)
    console.log('Room revenue API Response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Room revenue API Error Response:', errorText)
      throw new Error(`API call failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json();
    console.log('Room revenue API Response data:', data)
    return data;
  } catch (error) {
    console.error('Error saving room revenue changes:', error);
    throw error;
  }
}

export function extractAllRoomRevenuePackages(roomRevenueData) {
  const all = new Set();
  for (const year in roomRevenueData) {
    for (const month in roomRevenueData[year]) {
      roomRevenueData[year][month].forEach(e => all.add(e.room_package));
    }
  }
  return [...all].sort();
}

// API call to create a new Room Market Segment
export async function createRoomMarketSegment(segmentName, categoryName) {
  try {
    console.log('Creating room market segment:', segmentName, 'in category:', categoryName);
    
    const params = new URLSearchParams();
    params.append('market_segment', segmentName);
    params.append('segment_category', categoryName);
    
    const response = await fetch('/api/v2/method/ex_forcast.api.room_market_segment_api.create_room_market_segment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Room Market Segment creation response:', data);
    return data;
  } catch (error) {
    console.error('Error creating room market segment:', error);
    throw error;
  }
}

// API call to fetch all Room Market Segments
export async function getRoomMarketSegments() {
  try {
    const response = await fetch('/api/v2/method/ex_forcast.api.room_market_segment_api.get_room_market_segments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    // console.log('Room Market Segments response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching room market segments:', error);
    throw error;
  }
}

// API call to fetch default Room Market Segments (module = "Ex Forcast")
export async function getDefaultRoomMarketSegments() {
  try {
    const response = await fetch('/api/v2/method/ex_forcast.api.room_market_segment_api.get_default_room_market_segments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Default Room Market Segments response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching default room market segments:', error);
    throw error;
  }
}

// API call to delete a Room Market Segment
export async function deleteRoomMarketSegment(segmentName) {
  try {
    console.log('Deleting room market segment:', segmentName);
    
    const params = new URLSearchParams();
    params.append('market_segment', segmentName);
    
    const response = await fetch('/api/v2/method/ex_forcast.api.room_market_segment_api.delete_room_market_segment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Room Market Segment deletion response:', data);
    return data;
  } catch (error) {
    console.error('Error deleting room market segment:', error);
    throw error;
  }
}

// Custom API call to fetch Market Segment data from our Frappe backend
export async function getMarketSegmentList() {
  try {
    // Get the currently selected project
    const currentProject = selectedProject.value
    
    // console.log('getMarketSegmentList called with project:', currentProject?.project_name);
    
    if (!currentProject) {
      // Return special status to indicate no project selected
      return { 
        status: 'no_project_selected',
        message: 'No project selected'
      };
    }

    // Load market segment data filtered by project
    const response = await fetch(`/api/v2/method/ex_forcast.api.room_revenue_display.market_segment_display?project=${encodeURIComponent(currentProject.project_name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    // console.log('Market segment API response for project:', currentProject.project_name, data);
    
    // Check if the project has any data
    const marketSegmentData = data.data || {};
    const hasData = Object.keys(marketSegmentData).length > 0;
    
    if (!hasData) {
      return {
        status: 'no_data',
        message: `No market segment data found for project: ${currentProject.project_name}`,
        project: currentProject.project_name
      };
    }
    
    return marketSegmentData;
  } catch (error) {
    console.error('Error fetching market segment data:', error);
    return { 
      status: 'error',
      message: 'Failed to load market segment data'
    };
  }
}

// Custom API call to save Market Segment changes
export async function saveMarketSegmentChanges(changes) {
  try {
    // Get the currently selected project
    const currentProject = selectedProject.value
    
    if (!currentProject) {
      throw new Error('No project selected. Please select a project first.');
    }
    
    console.log('Sending market segment changes to API for project:', currentProject.project_name, changes)
    
    // Try URLSearchParams approach for Frappe API
    const params = new URLSearchParams()
    params.append('changes', JSON.stringify(changes))
    params.append('project', currentProject.project_name)
    
    const response = await fetch('/api/v2/method/ex_forcast.api.room_revenue_display.upsert_market_segment_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`API call failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json();
    console.log('Market segment save response:', data);
    return data;
  } catch (error) {
    console.error('Error saving market segment changes:', error);
    throw error;
  }
} 