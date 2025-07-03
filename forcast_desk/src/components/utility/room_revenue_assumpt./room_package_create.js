// Utility to create a new Room Packages document
export async function createRoomPackage({ package_name, number_of_rooms }) {
  try {
    const params = new URLSearchParams();
    params.append('package_name', package_name);
    params.append('number_of_rooms', number_of_rooms);

    const response = await fetch("/api/method/ex_forcast.api.room_packages_list.create_room_package", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
      credentials: "include",
    });
    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
} 