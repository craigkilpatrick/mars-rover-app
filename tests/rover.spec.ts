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
            roverList: [{ id: 1, x: 0, y: 0, direction: 'N', color: '#06b6d4' }],
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
    await expect(page.locator('[data-testid="rover-card-1"]')).toBeVisible()
  })

  test('should allow selecting a rover', async ({ page }) => {
    // Click the select button inside the first rover card
    await page.locator('[data-testid="rover-card-1"] button').first().click()

    // Verify that the rover controls become visible
    await expect(page.locator('[data-testid="rover-controls"]')).toBeVisible()

    // Verify that the rover position is displayed
    const positionText = await page.locator('[data-testid="rover-position"]').textContent()
    expect(positionText).toContain('X: 0 Y: 0')
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
        body: JSON.stringify({ id: 1, x: 0, y: 1, direction: 'N', color: '#06b6d4' }),
      })
    })

    // Select the rover
    await page.locator('[data-testid="rover-card-1"] button').first().click()

    // Click the forward button
    await page.getByRole('button', { name: 'forward' }).click()

    // Wait for the new position text
    await expect(page.locator('[data-testid="rover-position"]')).toContainText('Y: 1')
  })

  test('should display grid', async ({ page }) => {
    // The 3D Mars scene should be visible
    await expect(page.locator('[data-testid="mars-scene"]')).toBeVisible()
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

    // Verify error toast is displayed with error message
    await expect(page.getByText(/failed to load rovers/i).first()).toBeVisible()
  })
})
