import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const meta = { component: Tooltip } satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">호버하세요</Button>
        </TooltipTrigger>
        <TooltipContent>halfmoon 토큰으로 테마링된 툴팁</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
