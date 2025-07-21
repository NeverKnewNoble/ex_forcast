// Utility to create a new Room Packages document
export async function createRoomPackage({ package_name, number_of_rooms, project_name = null }) {
  try {
    const params = new URLSearchParams();
    params.append('package_name', package_name);
    params.append('number_of_rooms', number_of_rooms);
    if (project_name) {
      params.append('project_name', project_name);
    }

    // console.log('Creating room package with params:', { package_name, number_of_rooms, project_name });

    const response = await fetch("/api/method/ex_forcast.api.room_packages_list.create_room_package", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
      credentials: "include",
    });
    
    // console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      // console.error('API error response:', errorText);
      return { success: false, error: errorText };
    }
    
    const data = await response.json();
    // console.log('API success response:', data);
    return data;
  } catch (error) {
    // console.error('Network error:', error);
    return { success: false, error: error.message };
  }
} 