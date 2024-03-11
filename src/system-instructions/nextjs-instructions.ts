export const nextjsInstructions = `
Prefer using App Directory over Pages Directory.
Use React Server Components unless you need client side dynamic stuff.
Use Next.js Image component for images.
When using Next.js Link component, don't nest <a> tags inside it. That was deprecated and removed.
`;

export const nextjsInstructionsPlugin = {
  name: "nextjs-instructions",
  description: "Instructions for using Next.js",
  instructions: nextjsInstructions,
};
