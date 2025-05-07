const isUserAdmin = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login again");
    return false;
  }

  const response = await fetch(`${BACKEND_URL}/auth/admin-login`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (data.status === 200) {
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}

export { isUserAdmin };
