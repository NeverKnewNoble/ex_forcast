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
    return {};
  }
}


export function extractAllRoomRevenuePackages(RoomRevenueData) {
  const all = new Set();
  for (const year in RoomRevenueData) {
    for (const month in RoomRevenueData[year]) {
      RoomRevenueData[year][month].forEach(e => all.add(e.expense));
    }
  }
  return [...all].sort();
} 