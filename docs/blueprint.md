# **App Name**: Photoshop AI Assistant

## Core Features:

- Prompt Input: Allows the user to enter a text prompt for the generative fill. The prompt accepts conversational language to provide more flexibility.
- Color Integration Tool: When selected, the app uses the current foreground color of the document, and communicates it to the generative fill process.
- Reference Image Upload: Enables the user to upload a reference image to influence the generative fill. Path of the uploaded image will be sent to the fill API as a tool.
- Selection Detection: Automatically detects if there's an active document and a selection to generate the fill. Will send the selected area as context to the external service.
- Generative Fill Execution: Triggers the external service to generate an image based on the user's prompt and context. Shows a 'Generating...' message to indicate the service is processing the task.
- Image Placement: Seamlessly places the generated image back into the Photoshop document as a new layer, aligning with the original selection area.
- Temporary File Management: Automatically creates and deletes temporary files during the generation process, optimizing the workflow.

## Style Guidelines:

- Primary color: Electric Green (#00FF00) for a vibrant, high-tech feel.
- Background color: Dark Pink (#FF69B4) to provide a contrasting backdrop for creative work.
- Accent color: Neon Blue (#1E90FF) for interactive elements like buttons.
- Font: 'Inter', a grotesque-style sans-serif, for both headlines and body text, lending a modern and clean look to the UI.
- Use a simple and intuitive layout with a non-resizable dialog box to maintain focus.
- Employ flat, minimalist icons for clarity and a modern aesthetic.
- Use a subtle loading animation or progress bar to indicate processing.