export type Tags = string[];

const isOpenTag = (tag: string): boolean => tag.endsWith('/?');

const toOpen = (tag: string): string => {
  if (isOpenTag(tag)) {
    return tag;
  }
  const tagParts = tag.split('/');
  if (tagParts.length < 2) {
    return '';
  }
  tagParts.pop();
  tagParts.push('?');
  return tagParts.join('/');
};

/**
 * Manager for a set of tags
 */
export class TagManager {
  tags = new Set<string>();
  /**
   * Push an array of tags to the set
   * @param tags a list of tags
   */
  push(tags: string[]) {
    for (const tag of tags) {
      this.tags.add(tag);
    }
  }
  /**
   * Search for a list of open tags (ends with /?)
   */
  open(): Tags {
    const tags = [...this.tags.values()];
    return tags.filter(isOpenTag);
  }
  /**
   * Delete an open tag
   * @param tag the name of the tag
   */
  deleteOpen(tag: string): string {
    const openTag = toOpen(tag);
    this.tags.delete(openTag);
    return openTag;
  }

  /**
   * Check if the trigger would be triggered for the current tags
   * @param trigger a list of tags separated by spaces
   * @returns true if the trigger would be triggered
   */
  matchTrigger(trigger: string): boolean {
    const triggerParts = trigger.split(' ');
    const hasTag = (tag: string) => this.tags.has(tag); // eslint-disable-line unicorn/consistent-function-scoping
    return triggerParts.every(hasTag);
  }
  /**
   * Returns all the current tags
   */
  all(): string[] {
    return [...this.tags.values()].sort();
  }
  /**
   * Return true if there are no tags
   */
  isEmpty(): boolean {
    return this.tags.size === 0;
  }
}
