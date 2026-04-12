# AdriCarRental

A web-based car management system.

## Project Structure

The project has been refactored for better maintainability and modularity. The original monolithic CSS and JavaScript files have been split into logical, single-responsibility files.

### HTML

- `Project.html`: The main entry point of the application. It imports all necessary CSS and JavaScript modules.

### CSS (`css/`)

The styles are split by page sections and components:

- `base.css`: Global resets, CSS variables (colors, sizing), and base typography.
- `header.css`: Styles for the top navigation bar, logo, language selector, and header buttons.
- `layout.css`: Main page layout, including the grid system, sidebar styling, input panels, and stats bar.
- `components.css`: Styling for reusable UI components like tab strips, search boxes, sort selects, and empty states.
- `card.css`: Styles specifically for the individual car display cards and their image wrappers.
- `modal.css`: Styling for the modal overlays (Login, Register, Favorites, Details, Edit).
- `toast.css`: Styles for the animated notification toasts and error messages.

### JavaScript (`js/`)

The logic is split by features and responsibilities:

- `state.js`: Initializes and manages the global state variables (`cars`, `favorites`, `users`, `currentUser`, etc.) from LocalStorage.
- `i18n.js`: Handles internationalization, translation caching, language switching, and external translation API integration.
- `auth.js`: Manages user authentication workflows (Login, Register, Logout) and UI updates for the active user session.
- `crud.js`: Contains the core business logic for creating, editing, deleting car entries, and toggling favorites.
- `ui.js`: Handles DOM manipulation, rendering the car list, filtering/sorting, toggling modals, and triggering toasts.
- `app.js`: The main application entry point that kicks off initialization functions once the page loads.
