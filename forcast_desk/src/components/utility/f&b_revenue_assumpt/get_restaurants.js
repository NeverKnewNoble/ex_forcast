export async function getRestaurants() {
  try {
    const response = await fetch('/api/method/ex_forcast.api.create_restaurant.get_restaurants', {
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