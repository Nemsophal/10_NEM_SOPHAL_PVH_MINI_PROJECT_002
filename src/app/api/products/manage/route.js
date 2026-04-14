import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productName, price, description, imageUrl } = body;

    if (!productName || !price) {
      return Response.json(
        { error: "Product name and price are required" },
        { status: 400 }
      );
    }

    return Response.json(
      {
        product: {
          productId: Date.now().toString(),
          productName,
          price: parseFloat(price),
          description,
          imageUrl,
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
    const { productId, productName, price, description, imageUrl } = body;

     if (!productId || !productName || !price) {
       return Response.json(
         { error: "Product ID, name and price are required" },
         { status: 400 }
       );
     }

     return Response.json({
       product: {
         productId,
         productName,
         price: parseFloat(price),
         description,
         imageUrl,
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

