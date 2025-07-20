export async function getRestaurants(project = null) {
  try {
    let url = '/api/method/ex_forcast.api.create_restaurant.get_restaurants';
    if (project) {
      url += `?project=${encodeURIComponent(project)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.message && Array.isArray(data.message)) {
      return data.message;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
} 