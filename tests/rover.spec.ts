import { test, expect } from '@playwright/test'

test.describe('Mars Rover App', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the initial API responses
    await page.route('**/api/rovers', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          _embedded: {
            roverList: [{ id: 1, x: 0, y: 0, direction: 'N' }],
          },
        }),
      })
    })

    await page.route('**/api/obstacles', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          _embedded: {
            obstacleList: [],
          },
        }),
      })
    })

    await page.goto('/')
  })

  test('should load and display rovers', async ({ page }) => {
    await expect(page.locator('.MuiListItem-root')).toHaveCount(1)
  })

  test('should allow selecting a rover', async ({ page }) => {
    // Click the first rover in the list
    await page.locator('.MuiListItem-root').first().click()

    // Verify that the rover controls become visible
    await expect(page.locator('[data-testid="rover-controls"]')).toBeVisible()

    // Verify that the rover position is displayed
    const positionText = await page.locator('[data-testid="rover-position"]').textContent()
    expect(positionText).toContain('Position: (0, 0) N')
  })

  test('should move rover using controls', async ({ page }) => {
    // Set up the command response
    await page.route('**/api/rovers/1/commands', async route => {
      const request = route.request()
      const commands = await request.postDataJSON()

      // Verify we're sending the right command
      expect(commands).toEqual(['f'])

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          x: 0,
          y: 1,
          direction: 'N',
        }),
      })
    })

    // Update the rovers endpoint to return the new position after the command
    await page.route('**/api/rovers', async route => {
      const url = route.request().url()
      if (url.includes('/commands')) {
        await route.continue()
        return
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          _embedded: {
            roverList: [{ id: 1, x: 0, y: 1, direction: 'N' }],
          },
        }),
      })
    })

    // Select the rover first
    await page.locator('.MuiListItem-root').first().click()

    // Get initial position
    const initialPosition = await page.locator('[data-testid="rover-position"]').textContent()
    if (!initialPosition) throw new Error('Could not get initial position')

    // Click the forward button
    await page.locator('[data-testid="move-forward"]').click()

    // Wait for the new position text
    await expect(page.locator('[data-testid="rover-position"]')).toHaveText('Position: (0, 1) N')
  })

  test('should display grid', async ({ page }) => {
    // The grid should be visible
    await expect(page.locator('[data-testid="rover-grid"]')).toBeVisible()

    // Verify the canvas element exists within the grid
    await expect(page.locator('[data-testid="rover-grid"] canvas')).toBeVisible()
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Override the rovers endpoint to return an error
    await page.route('**/api/rovers', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal Server Error',
        }),
      })
    })

    // Reload the page to trigger the error
    await page.reload()

    // Verify error message is displayed
    await expect(page.locator('.MuiAlert-root')).toBeVisible()
    const errorText = await page.locator('.MuiAlert-message').textContent()
    expect(errorText).toContain('Failed to load rovers')
  })
})
