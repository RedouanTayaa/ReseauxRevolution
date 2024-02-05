import { createUserFixture, UserFixture } from './user.fixture';

describe("Feature: login", () => {
  let loginFixture: UserFixture;

  beforeEach(() => {
    loginFixture = createUserFixture();
  });

  describe("Rule: user login with username and password", () => {
    test("User login and get token", async () => {
      await loginFixture.whenUserLogin({email: 'test123', password: 'bigHidePassword'});

      loginFixture.thenShouldGetToken({token: '12345'});
    });
  });
});
