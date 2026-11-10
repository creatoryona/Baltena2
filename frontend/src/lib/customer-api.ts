const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3000"

export async function customerLogin(
  email: string,
  password: string,
) {
  const response = await fetch(
    `${API_URL}/admin/auth/customer/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    },
  )

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Invalid email or password",
    )
  }

  const token =
    data?.access_token ||
    data?.token ||
    data?.accessToken

  if (!token) {
    throw new Error(
      "Login succeeded but no token was returned",
    )
  }

  // Admin logged in through the main Login page.
  if (data.role === "admin") {
    localStorage.setItem(
      "baltena_admin_token",
      token,
    )

    if (data.admin) {
      localStorage.setItem(
        "baltena_admin",
        JSON.stringify(data.admin),
      )
    }

    return data
  }

  // Customer logged in.
  localStorage.setItem(
    "baltena_customer_token",
    token,
  )

  if (data.customer) {
    localStorage.setItem(
      "baltena_customer",
      JSON.stringify(data.customer),
    )
  }

  return data
}

export async function customerRegister(
  name: string,
  email: string,
  password: string,
) {
  const response = await fetch(
    `${API_URL}/admin/auth/customer/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    },
  )

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Unable to create account",
    )
  }

  const token =
    data?.access_token ||
    data?.token ||
    data?.accessToken

  if (!token) {
    throw new Error(
      "Account created but no token was returned",
    )
  }

  localStorage.setItem(
    "baltena_customer_token",
    token,
  )

  if (data.customer) {
    localStorage.setItem(
      "baltena_customer",
      JSON.stringify(data.customer),
    )
  }

  return data
}

export function customerLogout() {
  localStorage.removeItem(
    "baltena_customer_token",
  )

  localStorage.removeItem(
    "baltena_customer",
  )

  window.location.href = "/"
}

export function getCustomerToken() {
  if (typeof window === "undefined") {
    return ""
  }

  return (
    localStorage.getItem(
      "baltena_customer_token",
    ) || ""
  )
}

export function isCustomerLoggedIn() {
  return Boolean(getCustomerToken())
}
