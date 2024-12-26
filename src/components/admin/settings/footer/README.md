# Footer Management

This module provides functionality for managing the website's footer content through an admin interface.

## Components

### FooterSettings
Main container component that renders the footer settings form and columns table.
- Handles fetching and updating footer settings
- Manages footer columns configuration
- Provides form for basic footer information

### FooterColumnsTable
Displays and manages footer columns in a table format.
- Allows adding and removing columns
- Shows column positions
- Handles reordering of columns

### FooterContentList
Renders a grid view of footer content organized by columns.
- Supports reordering content within columns
- Provides edit and delete functionality
- Shows content type information

### ContentTypeFields
Renders form fields based on the selected content type's configuration.
- Dynamically generates form fields
- Handles different field types (text, links, images, etc.)
- Manages form validation

### FormFields
Common form fields used across the footer management components.
- Provides consistent form field rendering
- Handles field validation
- Manages form state

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