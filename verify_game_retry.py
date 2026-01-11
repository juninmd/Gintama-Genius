from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to localhost:5174...")
            page.goto("http://localhost:5174", timeout=10000)

            # Wait for Start Button (Menu)
            print("Waiting for .start-button...")
            page.wait_for_selector(".start-button", timeout=5000)
            page.screenshot(path="/home/jules/verification/game_menu.png")
            print("Screenshot taken: /home/jules/verification/game_menu.png")

            # Click Start
            print("Clicking Start...")
            page.click(".start-button")

            # Wait for Game Board
            print("Waiting for .game-board...")
            page.wait_for_selector(".game-board", timeout=5000)

            # Wait a bit for animations
            time.sleep(1)

            page.screenshot(path="/home/jules/verification/game_board_active.png")
            print("Screenshot taken: /home/jules/verification/game_board_active.png")

            # Check for button classes specifically
            if page.locator(".btn-vermelho").count() > 0:
                print("Red button found.")
            if page.locator(".btn-azul").count() > 0:
                print("Blue button found.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
