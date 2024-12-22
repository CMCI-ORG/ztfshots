import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { SiteSettings } from "../SiteSettings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        maybeSingle: () => Promise.resolve({
          data: {
            id: "1",
            site_name: "Test Site",
            tag_line: "Test Tagline",
            description: "Test Description",
          },
          error: null,
        }),
      })),
      update: vi.fn(() => ({
        eq: () => Promise.resolve({
          data: null,
          error: null,
        }),
      })),
    })),
  },
}));

describe("SiteSettings", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SiteSettings />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("renders form with data when loaded", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SiteSettings />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/site name/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/site name/i)).toHaveValue("Test Site");
    expect(screen.getByLabelText(/tagline/i)).toHaveValue("Test Tagline");
    expect(screen.getByLabelText(/description/i)).toHaveValue("Test Description");
  });

  it("handles form submission", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SiteSettings />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/site name/i)).toBeInTheDocument();
    });

    const siteNameInput = screen.getByLabelText(/site name/i);
    fireEvent.change(siteNameInput, { target: { value: "Updated Site Name" } });

    const submitButton = screen.getByRole("button", { name: /save settings/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("site_settings");
    });
  });

  it("displays error message when update fails", async () => {
    // Mock error response
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      update: () => ({
        eq: () => Promise.reject(new Error("Update failed")),
      }),
    }));

    render(
      <QueryClientProvider client={queryClient}>
        <SiteSettings />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/site name/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", { name: /save settings/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/update failed/i)).toBeInTheDocument();
    });
  });
});