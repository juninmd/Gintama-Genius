from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        page.goto("http://localhost:5173")
        time.sleep(2)
        page.screenshot(path="desktop.png")

        # Click start
        page.click("button:has-text('Iniciar Missão')")
        time.sleep(1)
        page.screenshot(path="desktop_playing.png")

        context = browser.new_context(viewport={"width": 375, "height": 667})
        page2 = context.new_page()
        page2.goto("http://localhost:5173")
        time.sleep(2)
        page2.screenshot(path="mobile.png")

        page2.click("button:has-text('Iniciar Missão')")
        time.sleep(1)
        page2.screenshot(path="mobile_playing.png")

        browser.close()

if __name__ == "__main__":
    run()
