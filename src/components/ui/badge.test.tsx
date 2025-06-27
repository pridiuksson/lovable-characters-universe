import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';

describe('Badge Component', () => {
  it('should render with default variant', () => {
    render(<Badge>Default Badge</Badge>);
    const badgeElement = screen.getByText('Default Badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('bg-primary text-primary-foreground');
  });

  it('should render with secondary variant', () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badgeElement = screen.getByText('Secondary Badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('bg-secondary text-secondary-foreground');
  });

  it('should render with destructive variant', () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    const badgeElement = screen.getByText('Destructive Badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('bg-destructive text-destructive-foreground');
  });

  it('should render with outline variant', () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badgeElement = screen.getByText('Outline Badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('text-foreground');
  });

  it('should apply additional className', () => {
    render(<Badge className="custom-class">Custom Class Badge</Badge>);
    const badgeElement = screen.getByText('Custom Class Badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('custom-class');
  });

  it('should pass through other HTML attributes', () => {
    render(<Badge data-testid="my-badge">Attribute Badge</Badge>);
    const badgeElement = screen.getByTestId('my-badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveTextContent('Attribute Badge');
  });
});
