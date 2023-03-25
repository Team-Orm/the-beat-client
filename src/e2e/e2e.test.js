const puppeteer = require("puppeteer-core");

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;

const mockUser = {
  name: "Test man",
  email: "testman@example.com",
  password: "password123",
};

describe("Beat", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      defaultViewport: null,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: false,
      args: ["--start-fullscreen"],
    });
    page = await browser.newPage();
    await page.goto(`${CLIENT_URL}/login`);
  });

  afterAll(() => {
    browser.close();
  });

  describe("Login", () => {
    beforeEach(async () => {
      await page.goto(`${CLIENT_URL}/login`);
    });

    afterEach(async () => {
      await page.evaluate((email) => {
        fetch("/api/users/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
      }, mockUser.email);
    });

    it("should register a new user", async () => {
      await page.waitForSelector("[data-cy=register-button]");
      const registerButton = await page.$("[data-cy=register-button]");
      await registerButton.click();

      await page.type("[data-cy=register-name]", mockUser.name);
      await page.type("[data-cy=register-email]", mockUser.email);
      await page.type("[data-cy=register-password]", mockUser.password);
      await page.click("[data-cy=submit-button]");
      await page.waitForTimeout(500);
      const message = await page.$eval(
        "[data-cy=message]",
        (el) => el.textContent,
      );
      expect(message).toContain("유저가 등록 되었습니다.");
    });

    it("should login a user", async () => {
      await page.waitForSelector("[data-cy=login-button]");
      const loginButton = await page.$("[data-cy=login-button]");
      await loginButton.click();

      await page.click("[data-cy=login-button]");
      await page.type("[data-cy=login-email]", mockUser.email);
      await page.type("[data-cy=login-password]", mockUser.password);
      await page.click("[data-cy=submit-button]");

      await Promise.all([
        page.waitForNavigation(),
        page.click("[data-cy=submit-button]"),
      ]);

      await page.waitForTimeout(500);
      await page.screenshot({ path: "screenshot.png" });

      const currentUrl = await page.url();
      expect(currentUrl).toEqual(`${CLIENT_URL}/`);
    });
  });

  describe("RoomMaker", () => {
    let browser;
    let page;
    const mockUser = {
      name: "Test man",
      email: "testman@example.com",
      password: "password123",
    };

    const login = async () => {
      await page.waitForSelector("[data-cy=login-button]");
      await page.click("[data-cy=login-button]");
      await page.type("[data-cy=login-email]", mockUser.email);
      await page.type("[data-cy=login-password]", mockUser.password);
      await page.click("[data-cy=submit-button]");
      await page.waitForNavigation();
    };

    beforeEach(async () => {
      browser = await puppeteer.launch({
        executablePath:
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: false,
      });
      page = await browser.newPage();
      await page.goto(`${CLIENT_URL}/login`);
      await login();
    });

    afterEach(async () => {
      await browser.close();
    });

    it("should play and pause the song on play button click", async () => {
      const jwt = await page.evaluate(() => localStorage.getItem("jwt"));
      const createRoomBtn = await page.$("[data-cy=create-room]");
      await createRoomBtn.click();

      await page.waitForTimeout(500);

      if (jwt !== null) {
        await page.waitForSelector("[data-cy=play-button]");
        const playBtn = await page.$("[data-cy=play-button]");

        await playBtn.click();
        expect(await playBtn.evaluate((node) => node.textContent)).toContain(
          "⏸️ BGM OFF",
        );

        await playBtn.click();
        expect(await playBtn.evaluate((node) => node.textContent)).toContain(
          "🎵 BGM ON",
        );
      }
    });

    async function getComputedStyle(page, selector, prop) {
      const elementHandle = await page.$(selector);
      const element = elementHandle.asElement();

      if (!element) {
        throw new Error(`Unable to find element with selector "${selector}"`);
      }

      const value = await element.evaluate((el, prop) => {
        return window.getComputedStyle(el)[prop];
      }, prop);

      return value;
    }

    it("should hover and click a song container", async () => {
      const createRoomBtn = await page.$("[data-cy=create-room]");
      await createRoomBtn.click();

      await page.waitForSelector("[data-cy=song-container-0]");
      const songContainerSelector = "[data-cy=song-container-0]";
      const roomMakerContainerSelector = "[data-cy=room-maker-container]";

      const initialStyle = await getComputedStyle(
        page,
        roomMakerContainerSelector,
        "background-image",
      );

      const songContainer = await page.$(songContainerSelector);
      await songContainer.hover();

      const hoveredStyle = await getComputedStyle(
        page,
        roomMakerContainerSelector,
        "background-image",
      );

      expect(initialStyle).not.toEqual(hoveredStyle);

      await songContainer.click();
    });

    it("should click leave button and test navigation", async () => {
      const createRoomBtn = await page.$("[data-cy=create-room]");
      await createRoomBtn.click();

      await page.waitForSelector("[data-cy=leave-button]");
      const leaveButton = await page.$("[data-cy=leave-button]");
      await leaveButton.click();

      const currentUrl = await page.url();
      expect(currentUrl).toEqual(`${CLIENT_URL}/`);
    });

    it("should click create room button and test navigation", async () => {
      const createRoomBtn = await page.$("[data-cy=create-room]");
      await createRoomBtn.click();

      await page.waitForSelector("[data-cy=song-container-0]");
      const songContainerSelector = "[data-cy=song-container-0]";
      const songContainer = await page.$(songContainerSelector);
      await songContainer.click();

      await page.waitForSelector("[data-cy=create-button]");
      const createButtonSelector = "[data-cy=create-button]";
      const createButton = await page.$(createButtonSelector);
      await createButton.click();

      await page.waitForNavigation();
      const url = await page.url();
      const roomId = url.split("/").pop();
      expect(url).toContain(`/battles/${roomId}`);

      await page.waitForTimeout(500);

      await page.waitForSelector("[data-cy=exit-button]");
      const exitButton = await page.$("[data-cy=exit-button]");
      await exitButton.click();

      await page.waitForNavigation();
      const currentUrl = await page.url();
      expect(currentUrl).toEqual(`${CLIENT_URL}/`);
    });
  });
});
