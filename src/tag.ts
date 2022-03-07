export type Tags = string[];

const isOpenTag = (tag: string): boolean => tag.includes('?');

const shouldTrigger =
  (trigger: string) =>
  (tag: string): boolean =>
    tag === trigger;

const shouldAnyTagTrigger = (trigger: string, tags: Tags) =>
  tags.some(shouldTrigger(trigger));

class TagManager {
  tags = new Set<string>();
  push(tags: string[]) {
    for (const tag of tags) {
      this.tags.add(tag);
    }
  }
  open(): Tags {
    const tags = this.unique();
    return tags.filter(isOpenTag);
  }
}
