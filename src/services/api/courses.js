const API_BASE = "/api";

export async function fetchMyCourses(token) {
  const res = await fetch(`${API_BASE}/courses/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function createCourse(token, data) {
  const res = await fetch(`${API_BASE}/courses/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateCourse(token, courseId, data) {
  const res = await fetch(`${API_BASE}/courses/${courseId}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function fetchStudents(token, courseId) {
  const res = await fetch(`${API_BASE}/courses/${courseId}/students/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}
