from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:5173")
    page.wait_for_timeout(2000)
    page.get_by_role("button", name="Iniciar Missão").click()
    page.wait_for_timeout(4000) # wait for countdown and start playing
    page.screenshot(path="mobile_playing.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        iphone_13 = p.devices['iPhone 13']
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(**iphone_13)
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
