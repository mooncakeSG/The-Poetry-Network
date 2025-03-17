import { OpenAPIV3 } from 'openapi-types';
import { NextResponse } from 'next/server';

const spec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Poetry Network API',
    version: '1.0.0',
    description: 'API documentation for the Poetry Network application',
    contact: {
      name: 'API Support',
      email: 'support@poetrynetwork.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      description: 'API Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Poem: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
          },
          content: {
            type: 'string',
            minLength: 1,
            maxLength: 5000,
          },
          authorId: {
            type: 'string',
            format: 'uuid',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['id', 'title', 'content', 'authorId', 'createdAt', 'updatedAt'],
      },
      Mood: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          userId: {
            type: 'string',
            format: 'uuid',
          },
          value: {
            type: 'integer',
            minimum: 1,
            maximum: 5,
          },
          note: {
            type: 'string',
            maxLength: 500,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['id', 'userId', 'value', 'createdAt'],
      },
      Error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
        required: ['code', 'message'],
      },
    },
  },
  paths: {
    '/api/poems': {
      get: {
        summary: 'Get all poems',
        description: 'Retrieve a list of all poems with optional filtering and pagination',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
          {
            name: 'authorId',
            in: 'query',
            description: 'Filter poems by author ID',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of poems',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    poems: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Poem',
                      },
                    },
                    total: {
                      type: 'integer',
                    },
                    page: {
                      type: 'integer',
                    },
                    totalPages: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid parameters',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new poem',
        description: 'Create a new poem with the provided content',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 100,
                  },
                  content: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 5000,
                  },
                },
                required: ['title', 'content'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Poem created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Poem',
                },
              },
            },
          },
          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/poems/{id}': {
      get: {
        summary: 'Get poem by ID',
        description: 'Retrieve a specific poem by its ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Poem details',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Poem',
                },
              },
            },
          },
          '404': {
            description: 'Poem not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update poem',
        description: 'Update an existing poem',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 100,
                  },
                  content: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 5000,
                  },
                },
                required: ['title', 'content'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Poem updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Poem',
                },
              },
            },
          },
          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            description: 'Poem not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete poem',
        description: 'Delete a poem by its ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '204': {
            description: 'Poem deleted successfully',
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            description: 'Poem not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
    '/api/moods': {
      get: {
        summary: 'Get user moods',
        description: 'Retrieve a list of moods for the authenticated user',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'startDate',
            in: 'query',
            description: 'Start date for mood history',
            schema: {
              type: 'string',
              format: 'date',
            },
          },
          {
            name: 'endDate',
            in: 'query',
            description: 'End date for mood history',
            schema: {
              type: 'string',
              format: 'date',
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of moods',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Mood',
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create mood entry',
        description: 'Create a new mood entry for the authenticated user',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  value: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 5,
                  },
                  note: {
                    type: 'string',
                    maxLength: 500,
                  },
                },
                required: ['value'],
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Mood entry created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Mood',
                },
              },
            },
          },
          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
} 