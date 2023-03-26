describe("BattleRoom", () => {
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

  beforeEach(async () => {
    browser = await puppeteer.launch({
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: false,
    });

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

    await delay(2000);
    await page1.waitForSelector('[data-pt^="room-container-"]');
    const roomContainers = await page1.$$('[data-pt^="room-container-"]');

    for (const room of roomContainers) {
      const text = await page1.evaluate((element) => element.textContent, room);

      if (text.includes(user2.name)) {
        await room.click();
        break;
      }
    }
  });

  afterEach(async () => {
    await page1.waitForSelector("[data-pt=leave-button]");
    const leaveButtonUser1 = await page1.$("[data-pt=leave-button]");
    await leaveButtonUser1.click();

    await page2.waitForSelector("[data-pt=leave-button]");
    const leaveButtonUser2 = await page2.$("[data-pt=leave-button]");
    await leaveButtonUser2.click();

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

  it.only("real-time user rendering in battle room", async () => {
    await page2.$("[data-pt=battle-user]");
    const enteredUser = await page2.evaluate((element) => element.textContent);

    expect(enteredUser).toContain(user2.name);

    await page1.$("[data-pt=create-user]");
    const createdUser = await page1.evaluate((element) => element.textContent);

    expect(createdUser).toContain(user1.name);
  });

  it("real-time ready and start rendering in battle room", async () => {
    await page1.waitForSelector("[data-pt=ready-container]");
    const readyContainerSelector = "[data-pt=ready-container]";
    const readyButton = await page1.$(readyContainerSelector);
    await readyButton.click();

    await page1.waitForSelector("[data-pt=ready-left-container]");
    await page2.waitForSelector("[data-pt=ready-right-container]");

    const readyLeftWord = await page1.$("[data-pt=ready-left-container]");
    const leftText = await page1.evaluate(
      (element) => element.textContent,
      readyLeftWord,
    );
    expect(leftText).toContain("Ready");

    const readyRightWord = await page2.$("[data-pt=ready-right-container]");
    const rightText = await page2.evaluate(
      (element) => element.textContent,
      readyRightWord,
    );
    expect(rightText).toContain("Ready");

    await page2.waitForSelector("[data-pt=start-container]");
    const startButtonContainer = "[data-pt=start-container]";
    const startButton = await page2.$(startButtonContainer);
    await startButton.click();
  });

  it("real-time count rendering in battle room", async () => {
    await page1.waitForSelector("[data-pt=ready-container]");
    const readyContainerSelector = "[data-pt=ready-container]";
    const readyButton = await page1.$(readyContainerSelector);
    await readyButton.click();

    await page2.waitForSelector("[data-pt=start-container]");
    const startButtonContainer = "[data-pt=start-container]";
    const startButton = await page2.$(startButtonContainer);
    await startButton.click();

    for (let i = 3; i >= 1; i--) {
      await page1.waitForSelector(`[data-pt=countdown]`);
      await page2.waitForSelector(`[data-pt=countdown]`);

      const countdownLeft = await page1.$("[data-pt=countdown]");
      const countdownRight = await page2.$("[data-pt=countdown]");

      const leftCountdownText = await page1.evaluate(
        (element) => element.textContent,
        countdownLeft,
      );
      const rightCountdownText = await page2.evaluate(
        (element) => element.textContent,
        countdownRight,
      );

      expect(leftCountdownText).toContain(i.toString());
      expect(rightCountdownText).toContain(i.toString());
    }
  });

  const keysToPress = ["s", "d", "f", "j", "k", "l"];

  it("real-time key press effects of coulumns and key rendering in other's page", async () => {
    await page1.waitForSelector("[data-pt=ready-container]");
    const readyContainerSelector = "[data-pt=ready-container]";
    const readyButton = await page1.$(readyContainerSelector);
    await readyButton.click();

    await page2.waitForSelector("[data-pt=start-container]");
    const startButtonContainer = "[data-pt=start-container]";
    const startButton = await page2.$(startButtonContainer);
    await startButton.click();

    await page1.waitForSelector('[data-pt="battle-user-container"]');
    const battleUserGameController = await page1.$(
      '[data-pt="battle-user-container"]',
    );

    for (const key of keysToPress) {
      await page1.keyboard.down(key);
      await page1.waitForTimeout(100);
      await page1.keyboard.up(key);

      const keyIndex = keysToPress.indexOf(key);

      const keyContainer = await battleUserGameController.$(
        `[data-pt="key-container-${keyIndex}"]`,
      );
      const columnsContainer = await battleUserGameController.$(
        `[data-pt="column-container-${keyIndex}"]`,
      );

      const isKeyActiveInUser2 = await page2.evaluate(
        (element) => element.getAttribute.contains("data-active") === "true",
        keyContainer,
      );
      const isColumnActiveInUser2 = await page2.evaluate(
        (element) => element.getAttribute.contains("data-active") === "true",
        columnsContainer,
      );

      expect(isKeyActiveInUser2).toBeTruthy();
      expect(isColumnActiveInUser2).toBeTruty();

      await page1.waitForTimeout(100);
    }
  });

  it("real-time key press when note is HitBox middle and score and combo up", async () => {
    const SPEED = 300;
    const MILLISECOND = 1000;
    const canvasHeight = window.innerHeight;
    const canvasWidth = window.innerWidth;
    const columnHeight = canvasHeight * 0.9;
    const borderWidth = 5;
    const hitBoxPositionPercentage = 0.125;
    const positionOfHitBox =
      columnHeight * (1 - hitBoxPositionPercentage) - borderWidth * 2;
    const noteHeight = canvasWidth / (keysToPress.length * 3 * 3);
    const averageFrame = MILLISECOND / 60;
    const pixerPerFrame = (SPEED / 10) * averageFrame;
    const distanceToHitBoxMiddle = positionOfHitBox - noteHeight;
    const timeForNoteToReachHitBox = distanceToHitBoxMiddle / pixerPerFrame;

    await page1.waitForSelector("[data-pt=ready-container]");
    const readyContainerSelector = "[data-pt=ready-container]";
    const readyButton = await page1.$(readyContainerSelector);
    await readyButton.click();

    await page2.waitForSelector("[data-pt=start-container]");
    const startButtonContainer = "[data-pt=start-container]";
    const startButton = await page2.$(startButtonContainer);
    await startButton.click();

    await page1.waitForSelector("[data-pt=current-user-combo]");
    const beforeComboInUser1 = await page1.$("[data-pt=current-user-combo]");

    console.log(beforeComboInUser1, "beforeComboInUser1");

    await page1.waitForTimeout(timeForNoteToReachHitBox * 1000);
    await page1.keyboard.down(key);
    await page1.waitForTimeout(100);
    await page1.keyboard.up(key);

    await page1.waitForSelector("[data-pt=current-user-combo]");
    const afterComboInUser1 = await page1.$("[data-pt=current-user-combo]");

    console.log(afterComboInUser1, "afterComboUser1");

    await page2.waitForSelector("[data-pt=battle-user-combo]");
    const afterComboInUser2 = await page2.$("[data-pt=battle-user-combo]");

    console.log(afterComboInUser2, "afterComboUser2");

    expect(afterComboInUser1).toEqual(afterComboInUser2);

    await page1.waitForSelector("[data-pt=current-user-score]");
    const afterScoreInUser1 = await page1.$("[data-pt=current-user-score]");

    await page2.waitForSelector("[data-pt=battle-user-score]");
    const afterScoreInUser2 = await page2.$("[data-pt=battle-user-score]");

    expect(afterScoreInUser1).toEqual(afterScoreInUser2);
  });
});
