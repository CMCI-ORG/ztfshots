import { render, screen, fireEvent } from "@testing-library/react";
import { SiteSettingsForm } from "../SiteSettingsForm";
import { vi } from "vitest";

describe("SiteSettingsForm", () => {
  const defaultValues = {
    site_name: "Test Site",
    tag_line: "Test Tagline",
    description: "Test Description",
    icon_url: null,
    logo_url: null,
    cover_image_url: null,
  };

  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders form with default values", () => {
    render(
      <SiteSettingsForm
        defaultValues={defaultValues}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText(/site name/i)).toHaveValue("Test Site");
    expect(screen.getByLabelText(/tagline/i)).toHaveValue("Test Tagline");
    expect(screen.getByLabelText(/description/i)).toHaveValue("Test Description");
  });

  it("handles form submission", () => {
    render(
      <SiteSettingsForm
        defaultValues={defaultValues}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    const siteNameInput = screen.getByLabelText(/site name/i);
    fireEvent.change(siteNameInput, { target: { value: "Updated Site Name" } });

    const submitButton = screen.getByRole("button", { name: /save settings/i });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      ...defaultValues,
      site_name: "Updated Site Name",
    });
  });

  it("disables form submission while submitting", () => {
    render(
      <SiteSettingsForm
        defaultValues={defaultValues}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
      />
    );

    const submitButton = screen.getByRole("button", { name: /saving/i });
    expect(submitButton).toBeDisabled();
  });

  it("validates required fields", async () => {
    render(
      <SiteSettingsForm
        defaultValues={{ ...defaultValues, site_name: "" }}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    const submitButton = screen.getByRole("button", { name: /save settings/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/site name must be at least 2 characters/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});