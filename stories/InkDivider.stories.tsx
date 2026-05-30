import type { Meta, StoryObj } from '@storybook/react';
import { InkDivider } from '../components/wabi/InkDivider';
import React from 'react';

const meta: Meta<typeof InkDivider> = {
  title: 'Wabi/InkDivider',
  component: InkDivider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-16 bg-black min-h-[250px] flex flex-col justify-center text-white">
        <p className="text-xs text-zinc-500 mb-6 uppercase tracking-widest font-mono">
          Content Above Divider
        </p>
        <div className="w-full">
          <Story />
        </div>
        <p className="text-xs text-zinc-500 mt-6 uppercase tracking-widest font-mono">
          Content Below Divider
        </p>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InkDivider>;

export const Default: Story = {
  args: {},
};
