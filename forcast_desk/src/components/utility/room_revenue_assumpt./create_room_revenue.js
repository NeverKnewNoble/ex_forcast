import { createResource } from "frappe-ui"

// create room revenue expense
const roomRevenueResource = createResource({
    url: 'frappe.client.insert',
    makeParams({ doctype, doc }) {
        return {
            doc: {
                doctype,
                ...doc
            }
        }
    }
})


export async function createRoomRevenueAssumption({ year, month, room_revenue_assumptions }) {
    
    const room_revenue_assumptions_items = room_revenue_assumptions.map(item => ({
        room_package: item.revenue_name,
        number_of_rooms: item.number_of_rooms,
        rate: item.rate,
        occupied_beds: item.occupied_beds,
    }))

    const doc = {
        year,
        month,
        room_details: room_revenue_assumptions_items
    }

    

    try{
        const result = await roomRevenueResource.submit({
            doctype: "Room Revenue Assumptions",
            doc
        })

        console.log('Document created successfully:', result)
        return { success: true, name: result.name }
    }catch(error) {
        console.error('Error creating expense document:', error)
    }
}