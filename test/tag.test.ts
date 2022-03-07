import { TagManager } from '../src/tag';

describe('tag', () => {
  it('should manage simple tags', () => {
    const tagManager = new TagManager();
    tagManager.push(['immutable', 'boolean', 'string']);

    expect(tagManager.open()).toHaveLength(0);
    expect(tagManager.matchTrigger('immutable')).toBeTruthy();
    expect(tagManager.matchTrigger('mutable')).toBeFalsy();
  });
  it('should manage open tags', () => {
    const tagManager = new TagManager();
    tagManager.push(['immutable', 'type/?', 'type/boolean', 'type/string']);

    expect(tagManager.open()).toStrictEqual(['type/?']);
    expect(tagManager.matchTrigger('type/boolean')).toBeTruthy();
    expect(tagManager.matchTrigger('type/other')).toBeFalsy();
  });
  it('should delete open tag', () => {
    const tagManager = new TagManager();
    tagManager.push(['immutable', 'type/?', 'type/boolean', 'type/string']);
    tagManager.deleteOpen('type/?');
    expect(tagManager.deleteOpen('type/?')).toStrictEqual('type/?');
    expect(tagManager.all()).toStrictEqual([
      'immutable',
      'type/boolean',
      'type/string',
    ]);
  });
  it('should delete open tag from abstraction', () => {
    const tagManager = new TagManager();
    tagManager.push(['immutable', 'type/?', 'type/boolean', 'type/string']);
    tagManager.deleteOpen('type/?');
    expect(tagManager.deleteOpen('type/boolean')).toStrictEqual('type/?');
    expect(tagManager.all()).toStrictEqual([
      'immutable',
      'type/boolean',
      'type/string',
    ]);
  });
});
