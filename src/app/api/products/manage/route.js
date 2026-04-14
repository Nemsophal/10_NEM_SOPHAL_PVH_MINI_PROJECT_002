import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, price, description, imageUrl, colors, sizes, categoryId } = body;

    if (!name || !price) {
      return Response.json(
        { error: "Product name and price are required" },
        { status: 400 }
      );
    }

    return Response.json(
      {
        product: {
          id: Date.now().toString(),
          name,
          price: parseFloat(price),
          description,
          imageUrl,
          colors: colors || [],
          sizes: sizes || [],
          categoryId: categoryId || "",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create product:", error.message);
    return Response.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, price, description, imageUrl, colors, sizes, categoryId } = body;

     if (!id || !name || !price) {
       return Response.json(
         { error: "Product ID, name and price are required" },
         { status: 400 }
       );
     }

     return Response.json({
       product: {
         id,
         name,
         price: parseFloat(price),
         description,
         imageUrl,
         colors: colors || [],
         sizes: sizes || [],
         categoryId: categoryId || "",
       },
     });
  } catch (error) {
    console.error("Failed to update product:", error.message);
    return Response.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

     if (!productId) {
       return Response.json(
         { error: "Product ID is required" },
         { status: 400 }
       );
     }

     return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error.message);
    return Response.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

