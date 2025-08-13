// Receipts & Payments data service

const API_BASE = '/api/method/ex_forcast.api.call_and_save_receipts';

export async function loadReceiptsPaymentsData(project = null) {
  let url = `${API_BASE}.receipts_payments_display`;
  if (project) url += `?project=${encodeURIComponent(project)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.message || data;
}

export async function upsertReceiptsPaymentsItems(changes, project = null) {
  const formData = new FormData();
  formData.append('changes', JSON.stringify(changes || []));
  if (project) formData.append('project', project);
  const res = await fetch(`${API_BASE}.upsert_receipts_payments_items`, { method: 'POST', body: formData });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`HTTP ${res.status}: ${txt}`);
  }
  return await res.json();
}


