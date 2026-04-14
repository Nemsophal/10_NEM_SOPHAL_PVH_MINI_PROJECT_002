import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { getProductsService } from "@/service/products.service";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = params;

    if (!productId) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const products = await getProductsService(session.user.accessToken);

    const product = products.find(
      (p) => p.id?.toString() === productId?.toString() ||
             p.productId?.toString() === productId?.toString()
    );

    if (!product) {
      return Response.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return Response.json({ product });
  } catch (error) {
    console.error("Failed to fetch product:", error.message);
    return Response.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

