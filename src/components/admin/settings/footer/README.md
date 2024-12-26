# Footer Management

This module provides functionality for managing the website's footer content through an admin interface.

## Components

### FooterSettings
Main container component that renders the footer settings form and columns table.

### FooterColumnsTable
Displays and manages footer columns in a table format. Allows adding and removing columns.

### FooterContentList
Renders a grid view of footer content organized by columns. Supports reordering and editing content.

### ContentTypeFields
Renders form fields based on the selected content type's configuration.

### FormFields
Common form fields used across the footer management components.

## Data Structure

The footer content is organized into columns, where each column can contain multiple content blocks. Content blocks are typed (e.g., text, links, social media) and have specific fields based on their type.

### Content Types
- Text: Simple text content
- Link: Single link with text and URL
- Links: Multiple links
- Feed: RSS feed integration
- Image: Single image with alt text
- Address: Contact information
- Social: Social media links

## Usage

1. Create columns using the FooterColumnsTable
2. Add content to columns using the content form
3. Organize content within columns using drag handles
4. Edit or remove content as needed

## State Management

Footer data is managed through Supabase and queried using TanStack Query (React Query). The following tables are used:
- footer_columns
- footer_contents
- footer_content_types
- footer_settings