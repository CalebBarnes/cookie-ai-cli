import { sendChat } from "../src/send-chat"; // Adjust the import path as needed
// import * as mockStdin from "mock-stdin";
import readline from "readline";

// todo: Mock the API call in sendChat function
// todo: Mock the readline interface so that we can automatically confirm the command with user input "y"

describe("sendChat function", () => {
  // let stdin;
  let mockClose: jest.Mock;
  let mockQuestion: jest.Mock;
  let mockRl: readline.Interface;
  beforeEach(() => {
    // stdin = mockStdin.stdin();
    mockClose = jest.fn();
    // Prepare the mockQuestion to simulate async user input
    mockQuestion = jest.fn((query, callback) => {
      process.nextTick(callback, "y\n");
    });

    // Mock readline.createInterface or pass mock directly if injected
    jest.mock("readline", () => ({
      createInterface: jest.fn().mockReturnValue({
        question: mockQuestion,
        close: mockClose,
      }),
    }));
  });

  // beforeEach(() => {
  //   // stdin = mockStdin.stdin();
  //   // Reset mocks and set up a new mock readline interface before each test
  //   mockClose = jest.fn();
  //   mockQuestion = jest.fn().mockResolvedValueOnce("user input");

  //   // Instead of jest.spyOn, directly mock the return value of createInterface
  //   mockRl = {
  //     question: mockQuestion,
  //     close: mockClose,
  //   } as unknown as readline.Interface;
  // });

  // afterEach(() => {
  //   // stdin.restore();
  // });

  it("should handle user input correctly", async () => {
    // const rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout,
    //   terminal: false,
    // });

    const result = await sendChat({ rl: mockRl, message: "echo hello world" }); // Adjust based on how your function is supposed to be called
    console.log({ result });
  });
});
