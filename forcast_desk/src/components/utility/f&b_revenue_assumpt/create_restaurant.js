export async function createRestaurant({ cover_name }) {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('cover_name', cover_name);
    
    const response = await fetch('/api/method/ex_forcast.api.create_restaurant.create_restaurant', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (data.message && data.message.status === 'success') {
      return { success: true, name: data.message.docname };
    } else {
      return { success: false, error: data.message?.message || 'Unknown error' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
} 