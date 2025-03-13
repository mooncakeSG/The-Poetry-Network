# API Documentation

This document outlines the Poetry Network API endpoints and their usage.

## Authentication

All authenticated endpoints require a valid session cookie. Authentication is handled through NextAuth.js.

### Authentication Endpoints

```
GET /api/auth/session
GET /api/auth/providers
POST /api/auth/signin
POST /api/auth/signout
```

## Poems API

### Get Poems

```http
GET /api/poems
```

Query parameters:
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `sort` (string: 'latest' | 'popular', default: 'latest')

Response:
```json
{
  "poems": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "authorId": "string",
      "createdAt": "string",
      "author": {
        "id": "string",
        "name": "string",
        "image": "string"
      },
      "_count": {
        "likes": number,
        "comments": number
      }
    }
  ],
  "totalPages": number,
  "currentPage": number
}
```

### Get Single Poem

```http
GET /api/poems/{poemId}
```

Response:
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "authorId": "string",
  "createdAt": "string",
  "author": {
    "id": "string",
    "name": "string",
    "image": "string"
  },
  "tags": string[],
  "_count": {
    "likes": number,
    "comments": number
  },
  "userLiked": boolean
}
```

### Create Poem

```http
POST /api/poems
```

Request body:
```json
{
  "title": "string",
  "content": "string",
  "tags": string[]
}
```

### Like/Unlike Poem

```http
POST /api/poems/{poemId}/like
```

Response:
```json
{
  "liked": boolean
}
```

## Comments API

### Get Comments

```http
GET /api/poems/{poemId}/comments
```

Query parameters:
- `page` (number, default: 1)
- `limit` (number, default: 10)

Response:
```json
{
  "comments": [
    {
      "id": "string",
      "content": "string",
      "createdAt": "string",
      "author": {
        "id": "string",
        "name": "string",
        "image": "string"
      }
    }
  ],
  "totalPages": number,
  "currentPage": number
}
```

### Create Comment

```http
POST /api/poems/{poemId}/comments
```

Request body:
```json
{
  "content": "string"
}
```

## Workshops API

### Get Workshops

```http
GET /api/workshops
```

Query parameters:
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `type` (string: 'all' | 'hosting' | 'participating', default: 'all')

Response:
```json
{
  "workshops": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "isPrivate": boolean,
      "host": {
        "id": "string",
        "name": "string",
        "image": "string"
      },
      "_count": {
        "members": number,
        "submissions": number
      }
    }
  ],
  "totalPages": number,
  "currentPage": number
}
```

### Create Workshop

```http
POST /api/workshops
```

Request body:
```json
{
  "title": "string",
  "description": "string",
  "isPrivate": boolean
}
```

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error response format:
```json
{
  "message": "string"
}
```

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Webhooks

Coming soon... 