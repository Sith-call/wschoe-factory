/**
 * UI Component Tests
 * Tests: Button, Input, Card, ProgressBar, Badge rendering and behavior
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';

describe('Button Component', () => {
  it('should render with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should render as primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-brand-600');
  });

  it('should render secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('border-brand-300');
  });

  it('should render ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-transparent');
  });

  it('should apply size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button').className).toContain('text-sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button').className).toContain('text-lg');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.className).toContain('animate-spin');
  });

  it('should not show spinner when not loading', () => {
    render(<Button>Normal</Button>);
    const button = screen.getByRole('button');
    const svg = button.querySelector('svg.animate-spin');
    expect(svg).toBeNull();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have minimum touch target size (44px) for md size', () => {
    render(<Button size="md">Touch</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('min-h-[44px]');
  });

  it('should merge custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button').className).toContain('custom-class');
  });
});

describe('Input Component', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should render label when provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should associate label with input via htmlFor', () => {
    render(<Input label="Email" />);
    const label = screen.getByText('Email');
    const input = screen.getByLabelText('Email');
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
  });

  it('should display error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should apply error styling when error is present', () => {
    render(<Input error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('border-red-400');
  });

  it('should not apply error styling without error', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input.className).not.toContain('border-red-400');
  });

  it('should accept input value', () => {
    render(<Input defaultValue="test value" />);
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('should use custom id when provided', () => {
    render(<Input id="custom-id" label="Custom" />);
    const input = document.getElementById('custom-id');
    expect(input).toBeInTheDocument();
  });
});

describe('Card Component', () => {
  it('should render children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('should apply default md padding', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass('p-4');
  });

  it('should apply sm padding', () => {
    const { container } = render(<Card padding="sm">Content</Card>);
    expect(container.firstChild).toHaveClass('p-3');
  });

  it('should apply lg padding', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    expect(container.firstChild).toHaveClass('p-6');
  });

  it('should have rounded corners and shadow', () => {
    const { container } = render(<Card>Content</Card>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('rounded-2xl');
    expect(div.className).toContain('shadow-sm');
  });

  it('should merge custom className', () => {
    const { container } = render(<Card className="custom">Content</Card>);
    expect(container.firstChild).toHaveClass('custom');
  });
});

describe('ProgressBar Component', () => {
  it('should render progressbar role', () => {
    render(<ProgressBar value={50} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should set correct aria values', () => {
    render(<ProgressBar value={30} max={100} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '30');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should calculate percentage width', () => {
    render(<ProgressBar value={75} max={100} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.style.width).toBe('75%');
  });

  it('should cap at 100%', () => {
    render(<ProgressBar value={150} max={100} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.style.width).toBe('100%');
  });

  it('should handle custom max value', () => {
    render(<ProgressBar value={3} max={5} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.style.width).toBe('60%');
  });

  it('should display label when provided', () => {
    render(<ProgressBar value={50} label="Progress" />);
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('should display percent when showPercent is true', () => {
    render(<ProgressBar value={75} max={100} showPercent />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should not display percent by default', () => {
    render(<ProgressBar value={75} max={100} />);
    expect(screen.queryByText('75%')).not.toBeInTheDocument();
  });
});

describe('Badge Component', () => {
  it('should render children text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render default variant', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge.className).toContain('bg-gray-100');
  });

  it('should render success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');
    expect(badge.className).toContain('bg-brand-100');
  });

  it('should render error variant', () => {
    render(<Badge variant="error">Error</Badge>);
    const badge = screen.getByText('Error');
    expect(badge.className).toContain('bg-red-100');
  });

  it('should render warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText('Warning');
    expect(badge.className).toContain('bg-amber-100');
  });

  it('should render info variant', () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText('Info');
    expect(badge.className).toContain('bg-blue-100');
  });

  it('should have rounded-full for pill shape', () => {
    render(<Badge>Pill</Badge>);
    const badge = screen.getByText('Pill');
    expect(badge.className).toContain('rounded-full');
  });
});
