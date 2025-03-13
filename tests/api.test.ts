import { prisma } from '@/lib/prisma'

const BASE_URL = 'http://localhost:3000/api'

describe('API Tests', () => {
  let testDraftId: string
  let testPoemId: string
  let testWorkshopId: string
  let authToken: string

  beforeAll(async () => {
    // Create a test user and get auth token
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        bio: 'Test user for API testing',
      },
    })
    authToken = user.id // This is a simplified version, you might want to use a proper JWT token
  })

  afterAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com',
      },
    })
  })

  describe('Drafts API', () => {
    test('GET /api/drafts should return all drafts', async () => {
      const response = await fetch(`${BASE_URL}/drafts`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    })

    test('POST /api/drafts should create a new draft', async () => {
      const draftData = {
        title: 'Test Draft',
        content: 'This is a test draft content',
        tags: ['test', 'draft'],
      }

      const response = await fetch(`${BASE_URL}/drafts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(draftData),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.title).toBe(draftData.title)
      testDraftId = data.id
    })

    test('GET /api/drafts/[id] should return a specific draft', async () => {
      const response = await fetch(`${BASE_URL}/drafts/${testDraftId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.id).toBe(testDraftId)
    })

    test('PUT /api/drafts/[id] should update a draft', async () => {
      const updateData = {
        title: 'Updated Draft',
        content: 'This is an updated draft content',
        tags: ['test', 'updated'],
      }

      const response = await fetch(`${BASE_URL}/drafts/${testDraftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updateData),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.title).toBe(updateData.title)
    })

    test('DELETE /api/drafts/[id] should delete a draft', async () => {
      const response = await fetch(`${BASE_URL}/drafts/${testDraftId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      expect(response.status).toBe(204)
    })
  })

  describe('Poems API', () => {
    test('GET /api/poems should return all poems', async () => {
      const response = await fetch(`${BASE_URL}/poems`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    })

    test('POST /api/poems should create a new poem', async () => {
      const poemData = {
        title: 'Test Poem',
        content: 'This is a test poem content',
        tags: ['test', 'poem'],
      }

      const response = await fetch(`${BASE_URL}/poems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(poemData),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.title).toBe(poemData.title)
      testPoemId = data.id
    })

    test('GET /api/poems/[id] should return a specific poem', async () => {
      const response = await fetch(`${BASE_URL}/poems/${testPoemId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.id).toBe(testPoemId)
    })

    test('PUT /api/poems/[id] should update a poem', async () => {
      const updateData = {
        title: 'Updated Poem',
        content: 'This is an updated poem content',
        tags: ['test', 'updated'],
      }

      const response = await fetch(`${BASE_URL}/poems/${testPoemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updateData),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.title).toBe(updateData.title)
    })

    test('DELETE /api/poems/[id] should delete a poem', async () => {
      const response = await fetch(`${BASE_URL}/poems/${testPoemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      expect(response.status).toBe(204)
    })
  })

  describe('Workshops API', () => {
    test('GET /api/workshops should return all workshops', async () => {
      const response = await fetch(`${BASE_URL}/workshops`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    })

    test('POST /api/workshops should create a new workshop', async () => {
      const workshopData = {
        title: 'Test Workshop',
        description: 'This is a test workshop',
        tags: ['test', 'workshop'],
      }

      const response = await fetch(`${BASE_URL}/workshops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(workshopData),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.title).toBe(workshopData.title)
      testWorkshopId = data.id
    })

    test('GET /api/workshops/[id] should return a specific workshop', async () => {
      const response = await fetch(`${BASE_URL}/workshops/${testWorkshopId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.id).toBe(testWorkshopId)
    })

    test('PUT /api/workshops/[id] should update a workshop', async () => {
      const updateData = {
        title: 'Updated Workshop',
        description: 'This is an updated workshop',
        tags: ['test', 'updated'],
      }

      const response = await fetch(`${BASE_URL}/workshops/${testWorkshopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updateData),
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.title).toBe(updateData.title)
    })

    test('DELETE /api/workshops/[id] should delete a workshop', async () => {
      const response = await fetch(`${BASE_URL}/workshops/${testWorkshopId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      expect(response.status).toBe(204)
    })
  })
}) 