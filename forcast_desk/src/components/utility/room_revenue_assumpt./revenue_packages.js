// Custom API call to fetch room packages from Frappe backend
import { getCSRFToken } from '@/components/utility/dashboard/apiUtils.js';

export async function getRoomPackagesList(projectName = null) {
    try{
        let url = "/api/v2/method/ex_forcast.api.room_packages_list.get_room_packages";
        if (projectName) {
            url += `?project_name=${encodeURIComponent(projectName)}`;
        }
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Frappe-CSRF-Token": getCSRFToken()
            },
        })

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        return result
       //  // console.log("Room Package response:", result)
    }catch(error){
        console.error("Failed To Get List Of Room Packages")
        return {
            success: false,
            error: error.message,
            data: { room_packages: [] }
        }
    }
}

// Create default room packages for a project
export async function createDefaultRoomPackages(projectName) {
    try {
        const params = new URLSearchParams();
        params.append('project_name', projectName);

        const response = await fetch("/api/method/ex_forcast.api.room_packages_list.create_default_room_packages", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Frappe-CSRF-Token": getCSRFToken()
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

// Delete a room package from a project
export async function deleteRoomPackage(packageName, projectName) {
  try {
    const params = new URLSearchParams();
    params.append('package_name', packageName);
    params.append('project_name', projectName);

   //  // console.log('Deleting room package with params:', { packageName, projectName });

    const response = await fetch("/api/method/ex_forcast.api.room_packages_list.delete_room_package", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Frappe-CSRF-Token": getCSRFToken()
      },
      body: params,
      credentials: "include",
    });
    
   //  // console.log('Delete API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      // console.error('Delete API error response:', errorText);
      return { success: false, error: errorText };
    }
    
    const data = await response.json();
   //  // console.log('Delete API success response:', data);
    return data;
  } catch (error) {
    // console.error('Delete network error:', error);
    return { success: false, error: error.message };
  }
}