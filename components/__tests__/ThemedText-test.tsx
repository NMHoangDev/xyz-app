import * as React from 'react';
import renderer from 'react-test-renderer';

import { ThemedText } from '../ThemedText';

describe('ThemedText Component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<ThemedText>Snapshot test!</ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders with empty text', () => {
    const tree = renderer.create(<ThemedText></ThemedText>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
