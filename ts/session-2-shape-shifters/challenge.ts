// Session 2 Challenge: Build a Type-Safe API Framework
//
// PROBLEM: This API framework compiles but has zero type safety
// YOUR MISSION: Add generics to make it bulletproof while keeping it flexible
//
// RULES:
// - NO 'any' or 'unknown' types
// - Type inference must work automatically
// - Must be composable and reusable
// - Must handle real-world edge cases

// 🚨 BROKEN CODE BELOW - ADD GENERICS! 🚨

// This API client has no type safety at all
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // ❌ Returns 'any' - fix with generics!
  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  // ❌ Accepts 'any' data - fix with generics!
  async post(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // ❌ No type safety for updates - fix with generics!
  async put(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// This wrapper has no type constraints
function wrapInArray(item: any): any[] {
  return [item];
}

// This response wrapper loses all type information
function createApiResponse(data: any, status: number = 200): any {
  return {
    data,
    status,
    timestamp: new Date().toISOString(),
    success: status >= 200 && status < 300,
  };
}

// This cache has no type safety
class ResponseCache {
  private cache = new Map<string, any>();

  // ❌ No type safety for stored/retrieved data
  set(key: string, value: any): void {
    this.cache.set(key, value);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  // ❌ Transform function has no type constraints
  getOrTransform(key: string, transformer: (input: any) => any): any {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // This is unsafe - what if transformer fails?
    const transformed = transformer(null);
    this.cache.set(key, transformed);
    return transformed;
  }
}

// This pagination helper loses type information
function createPaginatedResponse(
  items: any[],
  page: number,
  pageSize: number
): any {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    data: items.slice(startIndex, endIndex),
    pagination: {
      page,
      pageSize,
      total: items.length,
      totalPages: Math.ceil(items.length / pageSize),
      hasNext: endIndex < items.length,
      hasPrevious: page > 1,
    },
  };
}

// This validator has no type safety
function validateApiResponse(response: any, requiredFields: string[]): boolean {
  if (!response || typeof response !== "object") {
    return false;
  }

  return requiredFields.every((field) => field in response);
}

// ADVANCED: This endpoint builder has no type inference
class EndpointBuilder {
  private endpoints: any = {};

  // ❌ Should infer types from endpoint configurations
  addEndpoint(name: string, config: any): this {
    this.endpoints[name] = config;
    return this;
  }

  // ❌ Should return properly typed endpoint caller
  build(): any {
    return this.endpoints;
  }

  // ❌ Should validate endpoint exists and return correct type
  getEndpoint(name: string): any {
    return this.endpoints[name];
  }
}

// BRUTAL CHALLENGE: Type-safe query builder
class QueryBuilder {
  private query: any = {};

  // ❌ Should constrain field names to object keys
  where(field: string, operator: string, value: any): this {
    this.query.where = this.query.where || [];
    this.query.where.push({ field, operator, value });
    return this;
  }

  // ❌ Should constrain sort fields to object keys
  orderBy(field: string, direction: "asc" | "desc" = "asc"): this {
    this.query.orderBy = { field, direction };
    return this;
  }

  // ❌ Should only allow selecting valid fields
  select(...fields: string[]): this {
    this.query.select = fields;
    return this;
  }

  // ❌ Should return typed results based on select fields
  build(): any {
    return this.query;
  }
}

export {
  ApiClient,
  wrapInArray,
  createApiResponse,
  ResponseCache,
  createPaginatedResponse,
  validateApiResponse,
  EndpointBuilder,
  QueryBuilder,
};

// 💡 HINTS:
//
// 1. Use generic type parameters: <T>, <TData>, <TResponse>
//
// 2. Add constraints with 'extends': <T extends SomeInterface>
//
// 3. Use conditional types for smart defaults: T extends string ? StringResult : GenericResult
//
// 4. Leverage keyof for type-safe field access: <T, K extends keyof T>
//
// 5. Use mapped types to transform object shapes: { [K in keyof T]: Transform<T[K]> }
//
// 6. Don't forget return type inference: Promise<ApiResponse<T>>

// EXAMPLES OF WHAT YOU'RE AIMING FOR:
//
// const client = new ApiClient<BaseApiResponse>('https://api.example.com')
// const user = await client.get<User>('/users/123')  // user: User
// const created = await client.post<User, CreateUserRequest>('/users', userData)
//
// const cached = new ResponseCache<User>()
// cached.set('user:123', user)  // Only accepts User objects
// const retrieved = cached.get('user:123')  // Returns User | undefined
//
// const query = new QueryBuilder<User>()
//   .where('name', 'eq', 'John')     // 'name' must be key of User
//   .select('id', 'name', 'email')   // Only User fields allowed
//   .build()  // Returns query with correct typing
