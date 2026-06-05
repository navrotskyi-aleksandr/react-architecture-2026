import { render } from '@testing-library/react';

import SharedUtil from './shared-util';

describe('SharedUtil', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SharedUtil />);
    expect(baseElement).toBeTruthy();
  });
});
