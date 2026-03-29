import { render, screen, cleanup } from "@testing-library/react";
import { test, vi, expect, beforeEach, describe, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Conversation } from "../pages/Conversation";
import { fetchMessages, sendMessage } from "../services/conversations.js"
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "@testing-library/jest-dom/vitest";

vi.mock("../services/conversations.js", () => ({
  fetchMessages: vi.fn(),
  sendMessage: vi.fn()
}));

function renderConversation() {
      return render(
      <MemoryRouter initialEntries={["/conversations/123"]}>
        <AuthContext.Provider value={{ currentUser: { id: "user-1" } }}>
           <Routes>
            <Route path="/conversations/:conversationId" element={<Conversation />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );
}


describe("Test resend functionality",  () =>{
   beforeEach(() => {
      vi.resetAllMocks();
    });

    afterEach(() => {
      cleanup();
    });


  test("assert resend button", async () =>{
    fetchMessages.mockResolvedValue([
      {
          id: "temp-1",
          authorId: "user-1",
          content: "test",
          status: "failed",
      },
    ]);
    renderConversation();
 
    expect(await screen.findByRole("button", { name: /resend/i })).toBeInTheDocument();
  });

  test("assert pending status on resend", async () => {
    fetchMessages.mockResolvedValue([
      {
          id: "temp-1",
          authorId: "user-1",
          content: "test",
          status: "failed",
      },
    ]);

    let resolvePromise;

    sendMessage.mockImplementation(() =>
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    renderConversation();
    const button = await screen.findByRole("button", { name: /resend/i });
    await userEvent.click(button);
    expect(await screen.findByText("Sending...")).toBeInTheDocument();
    expect(screen.queryByText(/Delivery failed/i)).not.toBeInTheDocument();
      resolvePromise({
        id: "server-1",
        authorId: "user-1",
        content: "test",
      });


  });

  test("resend button calls sendMessage", async () =>{

    fetchMessages.mockResolvedValue([
      {
          id: "temp-1",
          authorId: "user-1",
          content: "test",
          status: "failed",
      },
    ]);
    sendMessage.mockResolvedValue({
        id: "server-1",
        authorId: "user-1",
        content: "test",
      });
      renderConversation();
      const button = await screen.findByRole("button", { name: /resend/i });

      await userEvent.click(button);
      expect(sendMessage).toHaveBeenCalledWith("123", "test");
  })

  test("failed resend leaves message resendable", async () =>{
    fetchMessages.mockResolvedValue([
      {
          id: "temp-1",
          authorId: "user-1",
          content: "test",
          status: "failed",
      },
    ]);
    
    sendMessage.mockRejectedValue(new Error("Network error"));
    renderConversation();
    const button = await screen.findByRole("button", { name: /resend/i });

    await userEvent.click(button);
    expect(sendMessage).toHaveBeenCalledWith("123", "test");
    expect(await screen.findByRole("button", { name: /resend/i })).toBeInTheDocument();
  })

});

  test("successful resends removes original message", async () =>{
    fetchMessages.mockResolvedValue([
      {
          id: "temp-1",
          authorId: "user-1",
          content: "old failed",
          status: "failed",
      },
    ]);

    sendMessage.mockResolvedValue({
        id: "server-1",
        authorId: "user-1",
        content: "resent success",
    });

    renderConversation();
    const button = await screen.findByRole("button", { name: /resend/i });

    await userEvent.click(button);
    expect(await screen.findByText("resent success")).toBeInTheDocument();
    expect(screen.queryByText("old failed")).not.toBeInTheDocument();
  })



