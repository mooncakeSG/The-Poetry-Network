import { NextResponse } from 'next/server';

export async function GET() {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Poetry Network API',
      version: '1.0.0',
      description: 'API documentation for the Poetry Network application',
    },
    servers: [
      {
        url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        description: 'API server',
      },
    ],
    paths: {
      '/api/poems': {
        get: {
          summary: 'Get all poems',
          description: 'Retrieve a list of all poems',
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: 'Page number for pagination',
              schema: {
                type: 'integer',
                default: 1,
              },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Number of items per page',
              schema: {
                type: 'integer',
                default: 10,
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
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            title: { type: 'string' },
                            content: { type: 'string' },
                            author: {
                              type: 'object',
                              properties: {
                                name: { type: 'string' },
                                image: { type: 'string' },
                              },
                            },
                            createdAt: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                      total: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create a new poem',
          description: 'Create a new poem with the provided data',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'content'],
                  properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                  },
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
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      content: { type: 'string' },
                      author: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          image: { type: 'string' },
                        },
                      },
                      createdAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input data',
            },
            '401': {
              description: 'Unauthorized',
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
              description: 'Poem ID',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Poem details',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      content: { type: 'string' },
                      author: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          image: { type: 'string' },
                        },
                      },
                      createdAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
            '404': {
              description: 'Poem not found',
            },
          },
        },
        put: {
          summary: 'Update poem',
          description: 'Update a specific poem by its ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Poem ID',
              schema: {
                type: 'string',
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
                    title: { type: 'string' },
                    content: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Poem updated successfully',
            },
            '400': {
              description: 'Invalid input data',
            },
            '401': {
              description: 'Unauthorized',
            },
            '404': {
              description: 'Poem not found',
            },
          },
        },
        delete: {
          summary: 'Delete poem',
          description: 'Delete a specific poem by its ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'Poem ID',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            '200': {
              description: 'Poem deleted successfully',
            },
            '401': {
              description: 'Unauthorized',
            },
            '404': {
              description: 'Poem not found',
            },
          },
        },
      },
      '/api/moods': {
        get: {
          summary: 'Get user moods',
          description: 'Retrieve the mood history for the authenticated user',
          responses: {
            '200': {
              description: 'List of moods',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        mood: { type: 'string' },
                        notes: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
        post: {
          summary: 'Create mood entry',
          description: 'Create a new mood entry for the authenticated user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['mood'],
                  properties: {
                    mood: { type: 'string' },
                    notes: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Mood entry created successfully',
            },
            '400': {
              description: 'Invalid input data',
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };

  return NextResponse.json(spec);
} 