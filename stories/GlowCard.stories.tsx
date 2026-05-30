import type { Meta, StoryObj } from '@storybook/react';
import { GlowCard } from '../components/ui/GlowCard';
import React from 'react';

const meta: Meta<typeof GlowCard> = {
  title: 'UI/GlowCard',
  component: GlowCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-12 bg-black min-h-[300px] flex items-center justify-center">
        <div className="w-full max-w-md">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlowCard>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white min-h-[160px] flex flex-col justify-center">
        <h4 className="text-lg font-bold text-red-500 mb-2">Interactive Glow Card</h4>
        <p className="text-sm text-zinc-400">
          Move your cursor over this card to watch the radial ink-glow effect track your pointer dynamically.
        </p>
      </div>
    ),
  },
};
