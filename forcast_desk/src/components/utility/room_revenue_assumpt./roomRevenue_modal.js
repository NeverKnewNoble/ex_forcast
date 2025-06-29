import { ref } from "vue"

export const showAddRoomRevenueModal = ref(false)

export const addRoomRevenueForm = ref({
    year: "",
    month: "",
    rows: [{ revenue_name: "", number_of_rooms: 0, rate: "", occupied_beds: 0 }],
})

export function addRoomRevenueRow() {
    const newRow = { revenue_name: "", number_of_rooms: 0, rate: "", occupied_beds: 0 };
    addRoomRevenueForm.value.rows = [...addRoomRevenueForm.value.rows, newRow];
}

export function removeRoomRevenueRow(index) {
    if (addRoomRevenueForm.value.rows.length > 1) {
        const newRows = addRoomRevenueForm.value.rows.filter((_, i) => i !== index);
        addRoomRevenueForm.value.rows = newRows;
    }
}

export function resetRoomRevenueForm() {
    addRoomRevenueForm.value = {
        year: "",
        month: "",
        rows: [{ revenue_name: "", number_of_rooms: 0, rate: "", occupied_beds: 0 }],
    }
}

export function cancelAddRoomRevenue() {
    resetRoomRevenueForm()
    showAddRoomRevenueModal.value = false
}