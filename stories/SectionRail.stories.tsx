import type { Meta, StoryObj } from '@storybook/react';
import { SectionRail } from '../components/layout/SectionRail';
import React from 'react';

const meta: Meta<typeof SectionRail> = {
  title: 'Layout/SectionRail',
  component: SectionRail,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="bg-black min-h-[500px] relative p-8">
        <div className="max-w-md mx-auto space-y-64 py-16 text-white">
          <div id="intro" className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
            <h3 className="text-xl font-bold">Introduction Section</h3>
            <p className="text-sm text-zinc-400 mt-2">
              Scroll down to watch the dot navigation rail on the right update its active state.
            </p>
          </div>
          <div id="experience" className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
            <h3 className="text-xl font-bold">Experience Section</h3>
            <p className="text-sm text-zinc-400 mt-2">
              This dot is active because this section has scrolled into focus.
            </p>
          </div>
          <div id="projects" className="p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
            <h3 className="text-xl font-bold">Projects Section</h3>
            <p className="text-sm text-zinc-400 mt-2">
              Clicking any dot will smoothly snap the corresponding section into view.
            </p>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SectionRail>;

export const Default: Story = {
  args: {
    sections: [
      { id: 'intro', label: 'Intro' },
      { id: 'experience', label: 'Experience' },
      { id: 'projects', label: 'Projects' },
    ],
  },
};
