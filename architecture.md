# EYE Component Architecture

The `e-y-e` custom element has been refactored into a modular architecture to improve maintainability, readability, and separation of concerns. The functionality is now split across several JavaScript files, each responsible for a specific domain.

## File Structure

The core logic is organized into the following files:

-   `EYE.js`: This is the main file for the custom element. It defines the `EYE` class which extends `HTMLElement`, manages the element's state and lifecycle, and orchestrates the interactions between the different modules. It imports functionality from the other modules.

-   `ui.js`: This module is responsible for creating all the UI elements of the component, such as the menu, buttons, and sliders. Each UI component is created by a dedicated function.

-   `video.js`: This module handles all aspects of video processing. This includes accessing the user's camera (`getUserMedia`), polling the video stream for frames, and controlling the video playback.

-   `image.js`: This module provides utilities for capturing images from the video stream. It can capture raw image data, or a JPEG blob, and dispatches an event when a new picture is taken.

-   `canvas.js`: This module contains drawing utilities for the canvas. Currently, it includes a function to draw a line.

## Component-Based Approach

The `EYE` class in `EYE.js` acts as a controller. It maintains the component's properties and passes its instance (`this`) to the functions from the other modules. This allows the helper functions in other modules to access and manipulate the state and DOM of the `e-y-e` element in a controlled way.

This modular design makes it easier to:
-   Locate code related to a specific feature.
-   Test individual components in isolation.
-   Extend the component with new functionality without modifying large files.
