const puppeteer = require("puppeteer-core");

const CLIENT_URL = process.env.REACT_APP_CLIENT_URL;

const user = {
  name: "Test man",
  email: "testman@example.com",
  password: "password123",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Login", () => {
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
    }, user.email);
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
    }, user.email);

    await page.close();
    await browser.close();
  });

  beforeEach(async () => {
    await page.goto(`${CLIENT_URL}/login`);
  });

  afterEach(async () => {});

  it("should register a new user", async () => {
    await page.waitForSelector("[data-pt=register-button]");
    const registerContainerSelector = "[data-pt=register-button]";
    const registerButton = await page.$(registerContainerSelector);
    await registerButton.click();

    await page.type("[data-pt=register-name]", user.name);
    await page.type("[data-pt=register-email]", user.email);
    await page.type("[data-pt=register-password]", user.password);
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
      await page.type("[data-pt=login-email]", user.email);
      await page.type("[data-pt=login-password]", user.password);
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
  jest.setTimeout(60000);
  let browser;
  let page;

  const register = async (page, user) => {
    await page.waitForSelector("[data-pt=register-button]");
    const registerContainerSelector = "[data-pt=register-button]";
    const registerButton = await page.$(registerContainerSelector);
    await registerButton.click();

    await page.type("[data-pt=register-name]", user.name);
    await page.type("[data-pt=register-email]", user.email);
    await page.type("[data-pt=register-password]", user.password);
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
  };

  const login = async (page, user) => {
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
      await page.type("[data-pt=login-email]", user.email);
      await page.type("[data-pt=login-password]", user.password);
    }

    await page.waitForSelector("[data-pt=submit-button]");
    await page.click("[data-pt=submit-button]");
    await page.waitForNavigation();
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const loginUser = async (page, user) => {
    await page.goto(`${CLIENT_URL}/login`);
    await register(page, user);
    await login(page, user);
  };

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
    }, user.email);

    await loginUser(page, user);
  });

  beforeEach(async () => {
    await delay(1000);
  });

  afterEach(async () => {});

  afterAll(async () => {
    await page.evaluate((email) => {
      fetch(`http://localhost:8000/api/users/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
    }, user.email);

    await page.close();
    await browser.close();
  });

  it("should play and pause the song on play button click", async () => {
    const createRoomBtn = await page.$("[data-pt=create-room]");
    await createRoomBtn.click();

    await page.waitForSelector("[data-pt=play-button]");
    const playButtonContainer = "[data-pt=play-button]";
    const playButton = await page.$(playButtonContainer);
    await playButton.click();

    expect(await playButton.evaluate((node) => node.textContent)).toContain(
      "⏸️ BGM OFF",
    );

    await delay(1000);
    await playButton.click();
    expect(await playButton.evaluate((node) => node.textContent)).toContain(
      "🎵 BGM ON",
    );
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
    await page.waitForSelector("[data-pt=song-container-1]");
    const songContainerSelector = "[data-pt=song-container-1]";
    const roomBackGroundContainer = "[data-pt=room-maker-container]";

    const initialStyle = await getComputedStyle(
      page,
      roomBackGroundContainer,
      "background-image",
    );

    await page.waitForSelector("[data-pt=song-container-1]");
    const songContainer = await page.$(songContainerSelector);
    await songContainer.hover();

    const hoveredStyle = await getComputedStyle(
      page,
      roomBackGroundContainer,
      "background-image",
    );

    expect(initialStyle).not.toEqual(hoveredStyle);
  });

  it("should click leave button and test navigation", async () => {
    try {
      await page.waitForSelector("[data-pt=leave-button]");
      const leaveButton = await page.$("[data-pt=leave-button]");
      await leaveButton.click();

      await delay(1000);
      const currentUrl = await page.url();
      expect(currentUrl).toEqual(`${CLIENT_URL}/`);
    } catch (err) {
      console.log(err);
    }
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
