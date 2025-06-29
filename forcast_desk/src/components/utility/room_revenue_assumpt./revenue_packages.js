// Custom API call to fetch room packages from Frappe backend
export async function getRoomPackagesList() {
    try{
        const response  = await fetch("/api/v2/method/ex_forcast.api.room_packages_list.get_room_packages" , {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        return result
        // console.log("Room Package response:", result)
    }catch(error){
        console.error("Failed To Get List Of Room Packages")
    }
}