import type { Meta, StoryObj } from '@storybook/react';
import { InkDateStamp } from '../components/wabi/InkDateStamp';
import React from 'react';

const meta: Meta<typeof InkDateStamp> = {
  title: 'Wabi/InkDateStamp',
  component: InkDateStamp,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-16 bg-black min-h-[180px] flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InkDateStamp>;

export const Ghost: Story = {
  args: {
    date: '2026-05-30',
    variant: 'ghost',
  },
};

export const SealRedPress: Story = {
  args: {
    date: '2026-05-30',
    variant: 'seal',
  },
};
