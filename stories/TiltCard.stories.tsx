import type { Meta, StoryObj } from '@storybook/react';
import { TiltCard } from '../components/ui/TiltCard';
import React from 'react';

const meta: Meta<typeof TiltCard> = {
  title: 'UI/TiltCard',
  component: TiltCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-16 bg-black min-h-[350px] flex items-center justify-center">
        <div className="w-full max-w-sm">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TiltCard>;

export const Default: Story = {
  args: {
    maxTilt: 8,
    children: (
      <div className="p-8 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white min-h-[200px] flex flex-col justify-between shadow-2xl select-none">
        <div>
          <h4 className="text-xl font-bold mb-2">3D Perspective Tilt</h4>
          <p className="text-sm text-zinc-400">
            Hover and move your mouse to tilt the card in 3D space with dynamic perspective scaling.
          </p>
        </div>
        <div className="text-xs text-red-500 font-mono">maxTilt: 8deg</div>
      </div>
    ),
  },
};

export const ExtremeTilt: Story = {
  args: {
    maxTilt: 16,
    children: (
      <div className="p-8 rounded-xl bg-zinc-900/80 border border-zinc-800 text-white min-h-[200px] flex flex-col justify-between shadow-2xl select-none">
        <div>
          <h4 className="text-xl font-bold mb-2">Extreme 3D Tilt</h4>
          <p className="text-sm text-zinc-400">
            Double the tilt capacity for pronounced, high-impact mechanical movement on mouse movements.
          </p>
        </div>
        <div className="text-xs text-red-500 font-mono">maxTilt: 16deg</div>
      </div>
    ),
  },
};
