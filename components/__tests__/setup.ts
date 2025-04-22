beforeAll(() => {
  // Cấu hình trước khi chạy test
  jest.useFakeTimers();
});

afterEach(() => {
  // Dọn dẹp sau mỗi test
  jest.clearAllMocks();
});
