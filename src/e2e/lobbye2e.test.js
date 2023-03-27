const puppeteer = require("puppeteer-core");

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;

const mockUser = {
  name: "Test man",
  email: "testman@example.com",
  password: "password123",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

    await page.evaluate((email) => {
      fetch(`http://localhost:8000/api/users/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    }, mockUser.email);
  });

  afterAll(async () => {
    await page.evaluate((email) => {
      fetch(`http://localhost:8000/api/users/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    }, mockUser.email);

    await browser.close();
  });

  describe("Login", () => {
    beforeEach(async () => {
      await page.goto(`${CLIENT_URL}/login`);
    });

    it("should register a new user", async () => {
      await page.waitForSelector("[data-pt=register-button]");
      const registerContainerSelector = "[data-pt=register-button]";
      const registerButton = await page.$(registerContainerSelector);
      await registerButton.click();

      await page.type("[data-pt=register-name]", mockUser.name);
      await page.type("[data-pt=register-email]", mockUser.email);
      await page.type("[data-pt=register-password]", mockUser.password);
      await page.click("[data-pt=submit-button]");

      await page.waitForFunction(
        (selector, expectedText) =>
          document.querySelector(selector)?.textContent.includes(expectedText),
        {},
        "[data-pt=message]",
        "유저가 등록 되었습니다.",
      );

      const message = await page.$eval(
        "[data-pt=message]",
        (el) => el.textContent,
      );

      expect(message).toContain("유저가 등록 되었습니다.");
    });

    it("should login a user", async () => {
      await page.waitForSelector("[data-pt=login-button]");
      await page.click("[data-pt=login-button]");

      const emailInputValue = await page.$eval(
        "[data-pt=login-email]",
        (input) => input.value,
      );
      const passwordInputValue = await page.$eval(
        "[data-pt=login-password]",
        (input) => input.value,
      );

      if (emailInputValue === "" && passwordInputValue === "") {
        await page.type("[data-pt=login-email]", mockUser.email);
        await page.type("[data-pt=login-password]", mockUser.password);
      }

      await page.waitForSelector("[data-pt=submit-button]");
      await page.click("[data-pt=submit-button]");
      await page.waitForNavigation();

      await delay(1000);

      const currentUrl = await page.url();
      expect(currentUrl).toEqual(`${CLIENT_URL}/`);
    });
  });

  describe("RoomMaker", () => {
    let browser;
    let page;

    const login = async () => {
      await page.waitForSelector("[data-pt=login-button]");
      await page.click("[data-pt=login-button]");
      await page.type("[data-pt=login-email]", mockUser.email);
      await page.type("[data-pt=login-password]", mockUser.password);
      await page.click("[data-pt=submit-button]");
      await page.waitForNavigation();
    };

    beforeEach(async () => {
      browser = await puppeteer.launch({
        executablePath:
          "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: false,
        args: ["--start-fullscreen"],
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
      const createRoomBtn = await page.$("[data-pt=create-room]");
      await createRoomBtn.click();

      await page.waitForTimeout(500);

      if (jwt !== null) {
        await page.waitForSelector("[data-pt=play-button]");
        const playBtn = await page.$("[data-pt=play-button]");

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
      const createRoomBtn = await page.$("[data-pt=create-room]");
      await createRoomBtn.click();

      await page.waitForSelector("[data-pt=song-container-0]");
      const songContainerSelector = "[data-pt=song-container-0]";
      const roomMakerContainerSelector = "[data-pt=room-maker-container]";

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

    it("should click create room button and test navigation", async () => {
      const createRoomBtn = await page.$("[data-pt=create-room]");
      await createRoomBtn.click();

      await page.waitForSelector("[data-pt=song-container-0]");
      const songContainerSelector = "[data-pt=song-container-0]";
      const songContainer = await page.$(songContainerSelector);
      await songContainer.click();

      await page.waitForSelector("[data-pt=create-button]");
      const createButtonSelector = "[data-pt=create-button]";
      const createButton = await page.$(createButtonSelector);
      await createButton.click();

      await page.waitForNavigation();
      const url = await page.url();
      const roomId = url.split("/").pop();
      expect(url).toContain(`/battles/${roomId}`);

      await page.waitForTimeout(500);

      await page.waitForSelector("[data-pt=exit-button]");
      const exitButton = await page.$("[data-pt=exit-button]");
      await exitButton.click();

      await page.waitForNavigation();
      const currentUrl = await page.url();
      expect(currentUrl).toEqual(`${CLIENT_URL}/`);
    });
  });
});
