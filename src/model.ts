/**
 * A single choice in a multiple choices prompt
 */
export interface PromptChoice {
  title: string;
  description: string;
  value: string;
}

/**
 * A prompt for a text input
 */
export interface PromptText {
  name: string;
  message: string;
}
