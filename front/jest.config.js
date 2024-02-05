module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    globalSetup: 'jest-preset-angular/global-setup',
    moduleNameMapper: {
        "@src/(.*)": "<rootDir>/src/$1",
        "@base/(.*)": "<rootDir>/src/base/$1",
        "@core/(.*)": "<rootDir>/src/core/$1",
        "@environment/(.*)": "<rootDir>/src/environment/$1",
        "@users/(.*)": "<rootDir>/src/users/$1",
        "@posts/(.*)": "<rootDir>/src/posts/$1",
        "@presentation/(.*)": "<rootDir>/src/presentation/$1",
        "@presentationUsers/(.*)": "<rootDir>/src/presentation/app/users/$1",
        "@presentationPosts/(.*)": "<rootDir>/src/presentation/app/posts/$1",
        "@tests/(.*)": "<rootDir>/tests/$1",
    }
};
