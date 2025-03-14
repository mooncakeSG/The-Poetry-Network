import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"
import { server } from "./mocks/server"
import 'whatwg-fetch'
import 'openai/shims/node'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Establish API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished
afterAll(() => server.close())

// Polyfill Request object for Next.js
if (typeof global.Request !== 'function') {
  // @ts-ignore
  global.Request = class Request extends URL {
    method: string
    body: any
    headers: Headers
    constructor(input: string | URL, init?: RequestInit) {
      super(input.toString())
      this.method = init?.method || 'GET'
      this.body = init?.body
      this.headers = new Headers(init?.headers)
    }
  }
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
}))

// Mock next-auth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => null),
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
  signIn: jest.fn(),
  signOut: jest.fn(),
})) 