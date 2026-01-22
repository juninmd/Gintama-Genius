from playwright.sync_api import sync_playwright

def verify_theme(page):
    # Go to app
    page.goto("http://localhost:5173")

    # Wait for menu
    page.wait_for_selector(".menu-container")

    # Take screenshot of menu (Initial State)
    page.screenshot(path="verification/menu.png")

    # Start game
    page.click(".start-button")

    # Wait for game board
    page.wait_for_selector(".game-board")

    # Take screenshot of game board
    page.screenshot(path="verification/gameboard.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_theme(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
