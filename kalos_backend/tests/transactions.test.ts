import { describe, it, expect } from "vitest";
import app from "../index";   

describe("Transaction API", () => {
  it("it should insert a valid transaction", async () => {
    const response = await app.request("/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Juan Pérez",
        amount: 150.5,
        currency: "USD"
      })
    });
    
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it("it should reject an invalid transaction", async () => {
    const response = await app.request("/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "",
        amount: -50,
        currency: ""
      })
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });

  it("it should list transactions", async () => {
    const response = await app.request("/transactions", {
      method: "GET",
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it("it should get the total", async () => {
    const response = await app.request("/transactions/total", {
      method: "GET"
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(typeof body.totalRevenue).toBe("number");
  });
});
