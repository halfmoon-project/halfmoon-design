import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const meta = { component: Tabs } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tokens" className="w-80">
      <TabsList>
        <TabsTrigger value="tokens">토큰</TabsTrigger>
        <TabsTrigger value="components">컴포넌트</TabsTrigger>
      </TabsList>
      <TabsContent value="tokens">DTCG 토큰이 단일 소스.</TabsContent>
      <TabsContent value="components">shadcn을 브리지로 테마링.</TabsContent>
    </Tabs>
  ),
};
