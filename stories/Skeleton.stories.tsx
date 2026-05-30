import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../components/ui/Skeleton';
import React from 'react';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-12 bg-black min-h-[200px] flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    width: '100%',
    height: '16px',
  },
};

export const Circle: Story = {
  args: {
    width: '60px',
    height: '60px',
    circle: true,
  },
};

export const CardPlaceholder: Story = {
  args: {
    width: '100%',
    height: '140px',
    className: 'rounded-xl',
  },
};
