import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { getProductsService } from "@/service/products.service";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const products = await getProductsService(session.user.accessToken);
        return Response.json({ products });
    } catch (error) {
        console.error("Failed to fetch products:", error.message);
        return Response.json(
            { error: error.message || "Failed to fetch products" },
            { status: 500 }
        );
    }
}
