export interface APIEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  summary: string
  description: string
  parameters: APIParameter[]
  responses: APIResponse[]
  tags: string[]
}

export interface APIParameter {
  name: string
  type: string
  required: boolean
  description: string
  location: 'query' | 'path' | 'body' | 'header'
  example?: string | number | boolean | null
}

export interface APIResponse {
  statusCode: number
  description: string
  schema?: object
  example?: string | number | boolean | null | object
}

export interface ParsedAPI {
  name: string
  baseUrl: string
  description: string
  endpoints: APIEndpoint[]
  authentication: {
    type: 'apiKey' | 'bearer' | 'oauth' | 'basic'
    location?: 'header' | 'query'
    name?: string
  }
  capabilities: string[]
}

// Predefined API configurations for popular services
const POPULAR_APIS: Record<string, ParsedAPI> = {
  stripe: {
    name: 'Stripe',
    baseUrl: 'https://api.stripe.com/v1',
    description: 'Payment processing and subscription management',
    authentication: { type: 'bearer' },
    endpoints: [
      {
        path: '/customers',
        method: 'GET',
        summary: 'List customers',
        description: 'Returns a list of your customers',
        parameters: [
          { name: 'limit', type: 'integer', required: false, description: 'Number of customers to return', location: 'query', example: 10 },
          { name: 'email', type: 'string', required: false, description: 'Filter by customer email', location: 'query' }
        ],
        responses: [
          { statusCode: 200, description: 'List of customers', example: { data: [], has_more: false } }
        ],
        tags: ['customers']
      },
      {
        path: '/customers',
        method: 'POST',
        summary: 'Create customer',
        description: 'Creates a new customer object',
        parameters: [
          { name: 'email', type: 'string', required: false, description: 'Customer email', location: 'body' },
          { name: 'name', type: 'string', required: false, description: 'Customer name', location: 'body' },
          { name: 'phone', type: 'string', required: false, description: 'Customer phone', location: 'body' }
        ],
        responses: [
          { statusCode: 200, description: 'Customer created', example: { id: 'cus_123', email: 'customer@example.com' } }
        ],
        tags: ['customers']
      },
      {
        path: '/payment_intents',
        method: 'POST',
        summary: 'Create payment intent',
        description: 'Creates a PaymentIntent object',
        parameters: [
          { name: 'amount', type: 'integer', required: true, description: 'Amount in cents', location: 'body', example: 2000 },
          { name: 'currency', type: 'string', required: true, description: 'Currency code', location: 'body', example: 'usd' },
          { name: 'customer', type: 'string', required: false, description: 'Customer ID', location: 'body' }
        ],
        responses: [
          { statusCode: 200, description: 'Payment intent created', example: { id: 'pi_123', status: 'requires_payment_method' } }
        ],
        tags: ['payments']
      },
      {
        path: '/subscriptions',
        method: 'GET',
        summary: 'List subscriptions',
        description: 'Returns a list of your subscriptions',
        parameters: [
          { name: 'customer', type: 'string', required: false, description: 'Filter by customer ID', location: 'query' },
          { name: 'status', type: 'string', required: false, description: 'Filter by status', location: 'query' }
        ],
        responses: [
          { statusCode: 200, description: 'List of subscriptions', example: { data: [], has_more: false } }
        ],
        tags: ['subscriptions']
      }
    ],
    capabilities: [
      'Process payments',
      'Manage customers',
      'Handle subscriptions',
      'Create invoices',
      'Manage payment methods'
    ]
  },
  shopify: {
    name: 'Shopify',
    baseUrl: 'https://{shop}.myshopify.com/admin/api/2023-10',
    description: 'E-commerce platform for online stores',
    authentication: { type: 'apiKey', location: 'header', name: 'X-Shopify-Access-Token' },
    endpoints: [
      {
        path: '/products.json',
        method: 'GET',
        summary: 'List products',
        description: 'Retrieve a list of products',
        parameters: [
          { name: 'limit', type: 'integer', required: false, description: 'Number of products to return', location: 'query', example: 50 },
          { name: 'status', type: 'string', required: false, description: 'Filter by status', location: 'query' }
        ],
        responses: [
          { statusCode: 200, description: 'List of products', example: { products: [] } }
        ],
        tags: ['products']
      },
      {
        path: '/orders.json',
        method: 'GET',
        summary: 'List orders',
        description: 'Retrieve a list of orders',
        parameters: [
          { name: 'status', type: 'string', required: false, description: 'Filter by order status', location: 'query' },
          { name: 'limit', type: 'integer', required: false, description: 'Number of orders to return', location: 'query', example: 50 }
        ],
        responses: [
          { statusCode: 200, description: 'List of orders', example: { orders: [] } }
        ],
        tags: ['orders']
      },
      {
        path: '/customers.json',
        method: 'GET',
        summary: 'List customers',
        description: 'Retrieve a list of customers',
        parameters: [
          { name: 'limit', type: 'integer', required: false, description: 'Number of customers to return', location: 'query', example: 50 }
        ],
        responses: [
          { statusCode: 200, description: 'List of customers', example: { customers: [] } }
        ],
        tags: ['customers']
      },
      {
        path: '/inventory_levels.json',
        method: 'GET',
        summary: 'Get inventory levels',
        description: 'Retrieve inventory levels for products',
        parameters: [
          { name: 'inventory_item_ids', type: 'string', required: false, description: 'Comma-separated inventory item IDs', location: 'query' }
        ],
        responses: [
          { statusCode: 200, description: 'Inventory levels', example: { inventory_levels: [] } }
        ],
        tags: ['inventory']
      }
    ],
    capabilities: [
      'Manage products',
      'Process orders',
      'Handle customers',
      'Track inventory',
      'Manage collections'
    ]
  },
  slack: {
    name: 'Slack',
    baseUrl: 'https://slack.com/api',
    description: 'Team communication and collaboration platform',
    authentication: { type: 'bearer' },
    endpoints: [
      {
        path: '/chat.postMessage',
        method: 'POST',
        summary: 'Send message',
        description: 'Sends a message to a channel',
        parameters: [
          { name: 'channel', type: 'string', required: true, description: 'Channel ID or name', location: 'body', example: '#general' },
          { name: 'text', type: 'string', required: true, description: 'Message text', location: 'body', example: 'Hello, world!' },
          { name: 'username', type: 'string', required: false, description: 'Bot username', location: 'body' }
        ],
        responses: [
          { statusCode: 200, description: 'Message sent', example: { ok: true, ts: '1234567890.123456' } }
        ],
        tags: ['messaging']
      },
      {
        path: '/users.list',
        method: 'GET',
        summary: 'List users',
        description: 'Lists all users in a Slack team',
        parameters: [
          { name: 'limit', type: 'integer', required: false, description: 'Number of users to return', location: 'query', example: 100 }
        ],
        responses: [
          { statusCode: 200, description: 'List of users', example: { ok: true, members: [] } }
        ],
        tags: ['users']
      },
      {
        path: '/channels.list',
        method: 'GET',
        summary: 'List channels',
        description: 'Lists all channels in a Slack team',
        parameters: [
          { name: 'exclude_archived', type: 'boolean', required: false, description: 'Exclude archived channels', location: 'query', example: true }
        ],
        responses: [
          { statusCode: 200, description: 'List of channels', example: { ok: true, channels: [] } }
        ],
        tags: ['channels']
      },
      {
        path: '/files.upload',
        method: 'POST',
        summary: 'Upload file',
        description: 'Uploads or creates a file',
        parameters: [
          { name: 'channels', type: 'string', required: false, description: 'Comma-separated list of channel names or IDs', location: 'body' },
          { name: 'content', type: 'string', required: false, description: 'File contents', location: 'body' },
          { name: 'filename', type: 'string', required: false, description: 'Filename of file', location: 'body' }
        ],
        responses: [
          { statusCode: 200, description: 'File uploaded', example: { ok: true, file: { id: 'F1234567890' } } }
        ],
        tags: ['files']
      }
    ],
    capabilities: [
      'Send messages',
      'Manage channels',
      'Handle users',
      'Upload files',
      'Create workflows'
    ]
  }
}

// Define types for OpenAPI spec
interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{ url: string }>;
  paths: Record<string, Record<string, OpenAPIPathItem>>;
  components?: {
    securitySchemes?: Record<string, OpenAPISecurityScheme>;
  };
}

interface OpenAPIPathItem {
  summary?: string;
  description?: string;
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses: Record<string, OpenAPIResponse>;
  tags?: string[];
}

interface OpenAPIParameter {
  name: string;
  in: 'query' | 'path' | 'body' | 'header';
  type?: string;
  required?: boolean;
  description?: string;
  example?: string | number | boolean | null;
}

interface OpenAPIRequestBody {
  content: Record<string, OpenAPIRequestBodyContent>;
}

interface OpenAPIRequestBodyContent {
  schema?: {
    type: string;
    properties?: Record<string, OpenAPIRequestBodyProperty>;
  };
}

interface OpenAPIRequestBodyProperty {
  type: string;
  description?: string;
  example?: string | number | boolean | null;
}

interface OpenAPIResponse {
  description: string;
  content?: Record<string, OpenAPIResponseContent>;
}

interface OpenAPIResponseContent {
  example?: string | number | boolean | null | object;
}

interface OpenAPISecurityScheme {
  type: 'http' | 'apiKey';
  scheme?: 'bearer';
  in?: 'header' | 'query';
  name?: string;
}

export class APIAnalyzer {
  async analyzeAPI(input: string): Promise<ParsedAPI> {
    // Check if it's a popular API
    const popularAPI = this.detectPopularAPI(input)
    if (popularAPI) {
      return popularAPI
    }

    // Try to parse as OpenAPI spec
    if (this.isOpenAPISpec(input)) {
      return this.parseOpenAPISpec(input)
    }

    // Try to analyze as URL
    if (this.isURL(input)) {
      return this.analyzeAPIFromURL(input)
    }

    throw new Error('Unable to analyze API. Please provide a valid URL or OpenAPI specification.')
  }

  private detectPopularAPI(input: string): ParsedAPI | null {
    const normalizedInput = input.toLowerCase()
    
    if (normalizedInput.includes('stripe') || normalizedInput.includes('api.stripe.com')) {
      return POPULAR_APIS.stripe
    }
    
    if (normalizedInput.includes('shopify') || normalizedInput.includes('myshopify.com')) {
      return POPULAR_APIS.shopify
    }
    
    if (normalizedInput.includes('slack') || normalizedInput.includes('slack.com/api')) {
      return POPULAR_APIS.slack
    }
    
    return null
  }

  private isOpenAPISpec(input: string): boolean {
    try {
      const parsed = JSON.parse(input)
      return parsed.openapi || parsed.swagger
    } catch (error: unknown) {
      console.error('Error parsing OpenAPI spec:', error)
      return false
    }
  }

  private isURL(input: string): boolean {
    try {
      new URL(input)
      return true
    } catch {
      return false
    }
  }

  private parseOpenAPISpec(spec: string): ParsedAPI {
    const parsed = JSON.parse(spec) as OpenAPISpec
    const endpoints: APIEndpoint[] = []

    // Parse paths
    Object.entries(parsed.paths || {}).forEach(([path, pathObj]: [string, Record<string, OpenAPIPathItem>]) => {
      Object.entries(pathObj).forEach(([method, methodObj]: [string, OpenAPIPathItem]) => {
        if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
          const parameters: APIParameter[] = []
          
          // Parse parameters
          if (methodObj.parameters) {
            methodObj.parameters.forEach((param: OpenAPIParameter) => {
              parameters.push({
                name: param.name,
                type: param.type || 'string',
                required: param.required || false,
                description: param.description || '',
                location: param.in,
                example: param.example
              })
            })
          }

          // Parse request body
          if (methodObj.requestBody?.content) {
            const content = methodObj.requestBody.content
            const jsonContent = content['application/json']
            if (jsonContent?.schema) {
              const requiredProperties = ('required' in jsonContent.schema && Array.isArray(jsonContent.schema.required)) ? jsonContent.schema.required : [];
              Object.entries(jsonContent.schema.properties || {}).forEach(([name, prop]: [string, OpenAPIRequestBodyProperty]) => {
                parameters.push({
                  name,
                  type: prop.type || 'string',
                  required: requiredProperties.includes(name),
                  description: prop.description || '',
                  location: 'body',
                  example: prop.example
                })
              })
            }
          }

          // Parse responses
          const responses: APIResponse[] = []
          Object.entries(methodObj.responses || {}).forEach(([code, response]: [string, OpenAPIResponse]) => {
            responses.push({
              statusCode: parseInt(code),
              description: response.description || '',
              example: response.content?.['application/json']?.example
            })
          })

          endpoints.push({
            path,
            method: method.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
            summary: methodObj.summary || '',
            description: methodObj.description || '',
            parameters,
            responses,
            tags: methodObj.tags || []
          })
        }
      })
    })

    return {
      name: parsed.info?.title || 'Unknown API',
      baseUrl: parsed.servers?.[0]?.url || '',
      description: parsed.info?.description || '',
      endpoints,
      authentication: this.parseAuthentication(parsed),
      capabilities: this.generateCapabilities(endpoints)
    }
  }

  private async analyzeAPIFromURL(url: string): Promise<ParsedAPI> {
    // For demo purposes, return a basic structure
    // In a real implementation, this would make HTTP requests to discover endpoints
    return {
      name: 'Custom API',
      baseUrl: url,
      description: 'Custom API endpoint',
      endpoints: [
        {
          path: '/',
          method: 'GET',
          summary: 'Root endpoint',
          description: 'Main API endpoint',
          parameters: [],
          responses: [{ statusCode: 200, description: 'Success' }],
          tags: ['general']
        }
      ],
      authentication: { type: 'apiKey' },
      capabilities: ['General API operations']
    }
  }

  private parseAuthentication(spec: OpenAPISpec): ParsedAPI['authentication'] {
    const securitySchemes = spec.components?.securitySchemes
    if (!securitySchemes) {
      return { type: 'apiKey' }
    }

    const firstScheme = Object.values(securitySchemes)[0] as OpenAPISecurityScheme
    if (firstScheme?.type === 'http' && firstScheme?.scheme === 'bearer') {
      return { type: 'bearer' }
    }
    
    if (firstScheme?.type === 'apiKey') {
      return {
        type: 'apiKey',
        location: firstScheme.in,
        name: firstScheme.name
      }
    }

    return { type: 'apiKey' }
  }

  private generateCapabilities(endpoints: APIEndpoint[]): string[] {
    const capabilities = new Set<string>()
    
    endpoints.forEach(endpoint => {
      endpoint.tags.forEach(tag => {
        capabilities.add(`Manage ${tag}`)
      })
      
      if (endpoint.method === 'GET') {
        capabilities.add('Retrieve data')
      }
      if (endpoint.method === 'POST') {
        capabilities.add('Create resources')
      }
      if (endpoint.method === 'PUT' || endpoint.method === 'PATCH') {
        capabilities.add('Update resources')
      }
      if (endpoint.method === 'DELETE') {
        capabilities.add('Delete resources')
      }
    })

    return Array.from(capabilities)
  }

  generateNaturalLanguageDescription(api: ParsedAPI): string {
    const { name, description, capabilities, endpoints } = api
    
    let desc = `${name} is ${description}. `
    desc += `It provides ${capabilities.length} main capabilities: ${capabilities.join(', ')}. `
    desc += `The API has ${endpoints.length} endpoints available for integration. `
    
    const methods = endpoints.reduce((acc, endpoint) => {
      acc[endpoint.method] = (acc[endpoint.method] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    desc += `Available operations include: `
    desc += Object.entries(methods).map(([method, count]) => `${count} ${method} endpoint${count > 1 ? 's' : ''}`).join(', ')
    desc += '.'

    return desc
  }
}