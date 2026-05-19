import { http, HttpResponse } from "msw";

const BASE = "http://localhost:5151/api";

// ── Shared fixtures ───────────────────────────────────────────────────────────

export const mockCitesInbound = {
  citesInboundId: 1,
  citesInboundSerialNo: "CI-2024-001",
  scientificName: "Python regius",
  commonName: "Ball Python",
  leatherTypeName: "Snake",
  colorName: "Brown",
  quantityReceived: 10,
  unitOfMeasureName: "MT",
  numberOfSkins: 5,
  citesNumber: "CITES-001",
  issueDate: "2024-01-15T00:00:00Z",
  documentTypeName: "Export Permit",
  acquisitionTypeName: "Wild",
  sourceName: "Supplier A",
  identification: "TAG-001",
  citesDetails: "Test details",
  notes: "Test notes",
};

export const mockColor = { colorId: 1, name: "Brown", createdAt: "2024-01-01T00:00:00Z" };
export const mockLeatherType = { leatherTypeId: 1, name: "Snake", createdAt: "2024-01-01T00:00:00Z" };
export const mockSource = { sourceId: 1, name: "Supplier A", createdAt: "2024-01-01T00:00:00Z" };
export const mockDocumentType = { documentTypeId: 1, name: "Export Permit", createdAt: "2024-01-01T00:00:00Z" };
export const mockAcquisitionType = { acquisitionTypeId: 1, name: "Wild", createdAt: "2024-01-01T00:00:00Z" };
export const mockUnitOfMeasure = { unitOfMeasureId: 1, name: "MT", createdAt: "2024-01-01T00:00:00Z" };
export const mockProduct = { productId: 1, productCode: "P001", description: "Bag", categoryName: "Bags", genderName: "Unisex", categoryId: 1, genderId: 1, priceItaly: 100, priceEU: 120, priceOutsideEU: 150, materials: [] };
export const mockCraftsman = { userId: 1, fullName: "John Doe", email: "john@test.com", isActive: true, createdAt: "2024-01-01T00:00:00Z" };
export const mockOutboundReason = { outboundReasonId: 1, name: "Sale", createdAt: "2024-01-01T00:00:00Z" };

const pagedResponse = (items: unknown[], total = items.length) => ({
  success: true,
  data: { items, totalCount: total, pageNumber: 1, pageSize: 10 },
});

const listResponse = (data: unknown[]) => ({ success: true, data });
const singleResponse = (data: unknown) => ({ success: true, data });

// ── Handlers ─────────────────────────────────────────────────────────────────

export const handlers = [

  // ── Auth ──────────────────────────────────────────────────────────────────
  http.post(`${BASE}/auth/login`, () =>
    HttpResponse.json({ success: true, data: { token: "test-token", refreshToken: "test-refresh", role: "Admin", email: "admin@test.com", fullName: "Admin User", userId: 1 } })
  ),
  http.post(`${BASE}/auth/logout`, () => HttpResponse.json({ success: true })),

  // ── CITES Inbounds ────────────────────────────────────────────────────────
  http.get(`${BASE}/cites-inbounds`, () =>
    HttpResponse.json(pagedResponse([mockCitesInbound]))
  ),
  http.get(`${BASE}/cites-inbounds/:id`, () =>
    HttpResponse.json(singleResponse({ ...mockCitesInbound, usageHistories: [] }))
  ),
  http.post(`${BASE}/cites-inbounds`, () =>
    HttpResponse.json({ success: true, message: "CITES Inbound Created" })
  ),
  http.put(`${BASE}/cites-inbounds/:id`, () =>
    HttpResponse.json({ success: true, message: "CITES Inbound Updated" })
  ),
  http.get(`${BASE}/cites-inbounds/:id/qrcode`, () =>
    new HttpResponse(new Blob(["fake-qr"], { type: "image/png" }))
  ),
  http.get(`${BASE}/cites-inbounds/:id/usage-history/export/pdf`, () =>
    new HttpResponse(new Blob(["fake-pdf"], { type: "application/pdf" }))
  ),
  http.get(`${BASE}/cites-inbounds/export/:type`, () =>
    new HttpResponse(new Blob(["fake-export"], { type: "application/octet-stream" }))
  ),

  // ── Finished Products ─────────────────────────────────────────────────────
  http.get(`${BASE}/finished-products/stock`, () =>
    HttpResponse.json(pagedResponse([]))
  ),
  http.get(`${BASE}/finished-products/sold`, () =>
    HttpResponse.json(pagedResponse([]))
  ),
  http.get(`${BASE}/finished-products/:id`, () =>
    HttpResponse.json(singleResponse({ product: mockProduct, production: {}, citesInbound: mockCitesInbound, customer: null }))
  ),
  http.post(`${BASE}/finished-products/:id/sell`, () =>
    HttpResponse.json({ success: true })
  ),

  // ── Products ──────────────────────────────────────────────────────────────
  http.get(`${BASE}/products`, () =>
    HttpResponse.json(pagedResponse([mockProduct]))
  ),
  http.get(`${BASE}/products/:id`, () =>
    HttpResponse.json(singleResponse(mockProduct))
  ),
  http.post(`${BASE}/products`, () =>
    HttpResponse.json({ success: true })
  ),
  http.put(`${BASE}/products/:id`, () =>
    HttpResponse.json({ success: true })
  ),
  http.delete(`${BASE}/products/:id`, () =>
    HttpResponse.json({ success: true })
  ),

  // ── System Values ─────────────────────────────────────────────────────────
  http.get(`${BASE}/colors`, () => HttpResponse.json(listResponse([mockColor]))),
  http.post(`${BASE}/colors`, () => HttpResponse.json({ success: true })),
  http.put(`${BASE}/colors/:id`, () => HttpResponse.json({ success: true })),
  http.delete(`${BASE}/colors/:id`, () => HttpResponse.json({ success: true })),

  http.get(`${BASE}/leather-types`, () => HttpResponse.json(listResponse([mockLeatherType]))),
  http.get(`${BASE}/sources`, () => HttpResponse.json(listResponse([mockSource]))),
  http.get(`${BASE}/document-types`, () => HttpResponse.json(listResponse([mockDocumentType]))),
  http.get(`${BASE}/acquisition-types`, () => HttpResponse.json(listResponse([mockAcquisitionType]))),
  http.get(`${BASE}/unit-of-measures`, () => HttpResponse.json(listResponse([mockUnitOfMeasure]))),
  http.get(`${BASE}/material-categories`, () => HttpResponse.json(listResponse([]))),
  http.get(`${BASE}/product-categories`, () => HttpResponse.json(listResponse([{ productCategoryId: 1, name: "Bags" }]))),
  http.get(`${BASE}/product-genders`, () => HttpResponse.json(listResponse([{ productGenderId: 1, name: "Unisex" }]))),
  http.get(`${BASE}/outbound-reasons`, () => HttpResponse.json(listResponse([mockOutboundReason]))),
  http.get(`${BASE}/outgoing-document-types`, () => HttpResponse.json(listResponse([]))),
  http.get(`${BASE}/destinations`, () => HttpResponse.json(listResponse([]))),

  // ── Materials ─────────────────────────────────────────────────────────────
  http.get(`${BASE}/materials`, () => HttpResponse.json(pagedResponse([]))),

  // ── Craftsmen ─────────────────────────────────────────────────────────────
  http.get(`${BASE}/craftsmen`, () => HttpResponse.json(pagedResponse([mockCraftsman]))),
  http.get(`${BASE}/craftsmen/:id`, () =>
    HttpResponse.json(singleResponse({ ...mockCraftsman, totalProductions: 3, activeProductions: 1, productions: [] }))
  ),

  // ── Productions ───────────────────────────────────────────────────────────
  http.get(`${BASE}/productions`, () => HttpResponse.json(pagedResponse([]))),

  // ── Users ─────────────────────────────────────────────────────────────────
  http.get(`${BASE}/users`, () => HttpResponse.json(pagedResponse([]))),
];
