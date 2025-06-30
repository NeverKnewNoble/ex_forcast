// Custom API call to fetch Room Revenue Information from our Frappe backend
export async function getRoomRevenueList() {
  try {
    const response = await fetch('/api/v2/method/ex_forcast.api.room_revenue_display.room_revenue_display', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching room revenue data:', error);
    return {};
  }
}

// Test API endpoint
export async function testAPI() {
  try {
    const response = await fetch('/api/v2/method/ex_forcast.api.room_revenue_display.test_api', {
      method: 'GET',
    });

    const data = await response.json();
    // console.log('Test API response:', data);
    return data;
  } catch (error) {
    // console.error('Test API error:', error);
    throw error;
  }
}

// Custom API call to save Room Revenue changes
export async function saveRoomRevenueChanges(changes) {
  try {
    console.log('Sending changes to API:', changes)
    
    // Try URLSearchParams approach for Frappe API
    const params = new URLSearchParams()
    params.append('changes', JSON.stringify(changes))
    
    const response = await fetch('/api/v2/method/ex_forcast.api.room_revenue_display.upsert_room_revenue_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    // console.log('API Response status:', response.status)
    // console.log('API Response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`API call failed with status ${response.status}: ${errorText}`)
    }

    const data = await response.json();
    // console.log('API Response data:', data)
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