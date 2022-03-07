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

export class TagManager {
  tags = new Set<string>();
  push(tags: string[]) {
    for (const tag of tags) {
      this.tags.add(tag);
    }
  }
  open(): Tags {
    const tags = [...this.tags.values()];
    return tags.filter(isOpenTag);
  }
  deleteOpen(tag: string): string {
    const openTag = toOpen(tag);
    this.tags.delete(openTag);
    return openTag;
  }
  matchTrigger(trigger: string): boolean {
    return this.tags.has(trigger);
  }
  all(): string[]{
    return [...this.tags.values()].sort()
  }
}
