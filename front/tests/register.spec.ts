import { createUserFixture, UserFixture } from './user.fixture';

describe("Feature: register", () => {
  let registerFixture: UserFixture;

  beforeEach(() => {
    registerFixture = createUserFixture();
  });

  describe("Rule: user login with username and password", () => {
    test("User login and get token", async () => {
      await registerFixture.whenUserRegister({email: 'test123', password: 'bigHidePassword'});

      registerFixture.thenShouldRegisterSuccess({username: 'test123'});
    });
  });
});
