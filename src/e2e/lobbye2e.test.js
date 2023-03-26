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
    browser.close();
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
      const loginContainerSelector = "[data-pt=login-button]";
      const loginButton = await page.$(loginContainerSelector);
      await loginButton.click();

      await page.waitForSelector("[data-pt=login-button]");
      await page.click("[data-pt=login-button]");

      await page.type("[data-pt=login-email]", mockUser.email);
      await page.type("[data-pt=login-password]", mockUser.password);

      await Promise.all([
        page.waitForNavigation({ time: 1000 }),
        page.click("[data-pt=submit-button]"),
      ]);

      await page.waitForSelector("[data-pt=element-after-login]", {
        timeout: 1000,
      });

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

    it("should click leave button and test navigation", async () => {
      const createRoomBtn = await page.$("[data-pt=create-room]");
      await createRoomBtn.click();

      await page.waitForSelector("[data-pt=leave-button]");
      const leaveButton = await page.$("[data-pt=leave-button]");
      await leaveButton.click();

      const currentUrl = await page.url();
      expect(currentUrl).toEqual(`${CLIENT_URL}/`);
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

describe("Lobby", () => {
  jest.setTimeout(20000);
  let browser;
  let page1, page2;

  const user1 = {
    name: "test-tiger",
    email: "user1@example.com",
    password: "password123",
  };
  const user2 = {
    name: "test-giraffe",
    email: "user2@example.com",
    password: "password123456",
  };

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

  beforeEach(async () => {
    browser = await puppeteer.launch({
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: false,
    });
  });

  afterEach(async () => {
    await logoutUser(page1);
    await logoutUser(page2);
  });

  afterAll(async () => {
    await Promise.all([
      page1.evaluate((email) => {
        fetch(`http://localhost:8000/api/users/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
      }, user1.email),

      page2.evaluate((email) => {
        fetch(`http://localhost:8000/api/users/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
      }, user2.email),
    ]);

    browser.close();
  });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const loginUser = async (page, user) => {
    await page.goto(`${CLIENT_URL}/login`);
    await register(page, user);
    await login(page, user);
  };

  const logoutUser = async (page) => {
    await page.click("[data-pt=logout-button]");
    await page.waitForNavigation();
  };

  it("real-time socket rendering for logged-in users", async () => {
    const incognitoContext1 = await browser.createIncognitoBrowserContext();
    const incognitoContext2 = await browser.createIncognitoBrowserContext();

    page1 = await incognitoContext1.newPage();
    page2 = await incognitoContext2.newPage();

    await loginUser(page1, user1);
    await loginUser(page2, user2);

    await logoutUser(page2);
    await login(page2, user2);

    await logoutUser(page1);
    await login(page1, user1);

    await delay(1000);

    await page1.waitForSelector('[data-pt^="user-container-"]');
    const userContainers = await page1.$$('[data-pt^="user-container-"]');

    let userFound = false;
    for (const userContainer of userContainers) {
      const text = await page1.evaluate((el) => el.textContent, userContainer);

      if (text.includes(user2.name)) {
        userFound = true;
        break;
      }
    }

    expect(userFound).toBeTruthy();
  });

  it("real-time socket rendering for room make", async () => {
    jest.setTimeout(30000);
    const incognitoContext1 = await browser.createIncognitoBrowserContext();
    const incognitoContext2 = await browser.createIncognitoBrowserContext();

    page1 = await incognitoContext1.newPage();
    page2 = await incognitoContext2.newPage();

    await loginUser(page1, user1);
    await loginUser(page2, user2);

    await logoutUser(page2);
    await login(page2, user2);

    await logoutUser(page1);
    await login(page1, user1);

    await delay(1000);

    try {
      const createRoomBtn = await page2.$("[data-pt=create-room]");
      await createRoomBtn.click();

      await page2.waitForSelector("[data-pt=song-container-0]");
      const songContainerSelector = "[data-pt=song-container-0]";
      const songContainer = await page2.$(songContainerSelector);
      await songContainer.click();

      await page2.waitForSelector("[data-pt=create-button]");
      const createButtonSelector = "[data-pt=create-button]";
      const createButton = await page2.$(createButtonSelector);
      await createButton.click();

      await page2.waitForNavigation();
      const url = await page2.url();
      const roomId = url.split("/").pop();
      expect(url).toContain(`/battles/${roomId}`);

      await delay(2000);
      await page1.waitForSelector('[data-pt^="room-container-"]');
      const roomContainers = await page1.$$('[data-pt^="room-container-"]');

      let roomFound = false;
      for (const room of roomContainers) {
        const text = await page1.evaluate((el) => el.textContent, room);

        if (text.includes(user2.name)) {
          roomFound = true;
          break;
        }
      }
      expect(roomFound).toBeTruthy();

      await delay(2000);
      await page2.waitForSelector("[data-pt=exit-button]");
      const exitButton = await page2.$("[data-pt=exit-button]");
      await exitButton.click();

      await page2.waitForNavigation();
      const currentUrl = await page2.url();

      expect(currentUrl).toEqual(`${CLIENT_URL}/`);
    } catch (err) {
      console.log(err);
    }
  });
});
