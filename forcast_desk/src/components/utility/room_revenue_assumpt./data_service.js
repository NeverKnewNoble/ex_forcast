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
    console.error('Error fetching room revenue data:', error);
    return {};
  }
}

export function extractAllRoomRevenuePackages(roomRevenueData) {
  const all = new Set();
  for (const year in roomRevenueData) {
    for (const month in roomRevenueData[year]) {
      roomRevenueData[year][month].forEach(e => all.add(e.room_package));
    }
  }
  return [...all].sort();
} 