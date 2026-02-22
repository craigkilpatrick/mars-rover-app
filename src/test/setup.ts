import '@testing-library/jest-dom'

// Mock ResizeObserver (not available in jsdom)
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect method with testing-library matchers
expect.extend(matchers)

// Mock canvas context with only the methods used in RoverGrid
const createCanvasContext = () => {
  const canvas = document.createElement('canvas')
  return {
    canvas,
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  } as unknown as CanvasRenderingContext2D
}

// Mock canvas element
const mockGetContext = vi.fn((contextId: string) => {
  if (contextId === '2d') {
    return createCanvasContext()
  }
  return null
})

HTMLCanvasElement.prototype.getContext =
  mockGetContext as unknown as typeof HTMLCanvasElement.prototype.getContext

// Cleanup after each test case
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

vi.mock('framer-motion', async () => {
  const React = await import('react')
  const MOTION_PROPS = new Set([
    'animate',
    'initial',
    'exit',
    'transition',
    'variants',
    'whileTap',
    'whileHover',
    'whileFocus',
    'whileInView',
    'layout',
    'layoutId',
  ])
  const makeMotion = (tag: string) => {
    const Component = React.forwardRef(
      ({ children, ...props }: Record<string, unknown>, ref: unknown) => {
        const domProps = Object.fromEntries(
          Object.entries(props).filter(([k]) => !MOTION_PROPS.has(k))
        )
        return React.createElement(tag, { ...domProps, ref }, children as React.ReactNode)
      }
    )
    Component.displayName = `motion.${tag}`
    return Component
  }
  return {
    motion: {
      div: makeMotion('div'),
      span: makeMotion('span'),
      button: makeMotion('button'),
      p: makeMotion('p'),
      ul: makeMotion('ul'),
      li: makeMotion('li'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
    useMotionValue: (initial: unknown) => ({ get: () => initial, set: vi.fn() }),
    useTransform: vi.fn(),
    MotionConfig: ({ children }: { children: React.ReactNode }) => children,
  }
})
