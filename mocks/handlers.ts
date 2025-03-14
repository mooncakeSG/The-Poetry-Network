import { http } from "msw"

export const handlers = [
  // Mock workshop endpoints
  http.get("/api/workshops", (req: any, res: any, ctx: any) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: "1",
          title: "Test Workshop",
          description: "Test Description",
          date: new Date().toISOString(),
          startTime: "10:00",
          endTime: "11:00",
          maxParticipants: 10,
          type: "Poetry Writing",
          host: {
            id: "1",
            name: "Test Host",
            image: null,
          },
          _count: {
            participants: 0,
          },
        },
      ])
    )
  }),

  rest.post("/api/workshops", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: "2",
        ...req.body,
        host: {
          id: "1",
          name: "Test Host",
          image: null,
        },
        _count: {
          participants: 0,
        },
      })
    )
  }),

  // Mock poem endpoints
  rest.get("/api/poems/latest", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: "1",
          title: "Test Poem",
          content: "Test Content",
          createdAt: new Date().toISOString(),
          author: {
            id: "1",
            name: "Test Author",
            image: null,
          },
          _count: {
            likes: 0,
            comments: 0,
          },
          userLiked: false,
        },
      ])
    )
  }),

  rest.post("/api/poems", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: "2",
        ...req.body,
        createdAt: new Date().toISOString(),
        author: {
          id: "1",
          name: "Test Author",
          image: null,
        },
        _count: {
          likes: 0,
          comments: 0,
        },
        userLiked: false,
      })
    )
  }),

  // Mock auth endpoints
  rest.post("/api/auth/session", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
          image: null,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
    )
  }),
] 