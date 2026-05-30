import type { Meta, StoryObj } from '@storybook/react';
import { SealStamp } from '../components/wabi/SealStamp';
import React from 'react';

const meta: Meta<typeof SealStamp> = {
  title: 'Wabi/SealStamp',
  component: SealStamp,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-16 bg-black min-h-[200px] flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SealStamp>;

export const Latin: Story = {
  args: {
    text: 'SUMIT',
    size: 'md',
    variant: 'latin',
    animate: true,
  },
};

export const Kanji: Story = {
  args: {
    size: 'md',
    variant: 'kanji',
    animate: true,
  },
};

export const SVGDoubleRing: Story = {
  args: {
    size: 'lg',
    variant: 'svg',
    animate: true,
  },
};

export const StaticSVG: Story = {
  args: {
    size: 'lg',
    variant: 'svg',
    animate: false,
  },
};
