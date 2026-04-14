export async function getProductsService(accessToken) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || "Failed to fetch products");
  }

  const pathsToCheck = [
    data,
    data?.payload,
    data?.payload?.products,
    data?.payload?.list,
    data?.payload?.items,
    data?.payload?.content,
    data?.data,
    data?.products,
    data?.list,
    data?.items,
    data?.content,
  ];

  const products = pathsToCheck.find(Array.isArray) ?? [];

  return products;
}

