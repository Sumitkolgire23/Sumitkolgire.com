import type { Meta, StoryObj } from '@storybook/react';
import { MagneticButton } from '../components/ui/MagneticButton';
import React from 'react';

const meta: Meta<typeof MagneticButton> = {
  title: 'UI/MagneticButton',
  component: MagneticButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-16 bg-black min-h-[250px] flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MagneticButton>;

export const Default: Story = {
  args: {
    strength: 0.3,
    children: (
      <button className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition-colors cursor-pointer select-none">
        Magnetic Button
      </button>
    ),
  },
};

export const HighSensitivity: Story = {
  args: {
    strength: 0.6,
    children: (
      <button className="px-6 py-3 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium transition-colors cursor-pointer select-none">
        High Sensitivity
      </button>
    ),
  },
};
