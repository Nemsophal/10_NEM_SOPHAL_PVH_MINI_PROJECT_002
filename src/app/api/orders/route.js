import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

// Mock database storage (replace with real database)
const ordersDB = new Map();

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      items,
      total,
      subtotal,
      shipping,
    } = body;

    if (!items || items.length === 0 || !total) {
      return Response.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    // Create order object
    const orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const order = {
      id: orderId,
      userId: session.user.id || session.user.email,
      orderDate: new Date().toISOString(),
      items: items, // Array of cart items
      subtotal: subtotal || total,
      shipping: shipping || 0,
      total: total,
      lineItems: items.length,
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    // Save to mock database
    if (!ordersDB.has(session.user.email)) {
      ordersDB.set(session.user.email, []);
    }
    const userOrders = ordersDB.get(session.user.email);
    userOrders.push(order);

    console.log("[Orders API] Order created:", orderId);
    console.log("[Orders API] User:", session.user.email);
    console.log("[Orders API] Total:", total);

    return Response.json(
      {
        success: true,
        order: order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create order:", error.message);
    return Response.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;

    // Get orders for this user from mock database
    const userOrders = ordersDB.get(userEmail) || [];

    console.log("[Orders API] Fetching orders for:", userEmail);
    console.log("[Orders API] Total orders:", userOrders.length);

    // Sort by date descending (newest first)
    const sortedOrders = userOrders.sort(
      (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
    );

    return Response.json({
      orders: sortedOrders,
      count: sortedOrders.length,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error.message);
    return Response.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

