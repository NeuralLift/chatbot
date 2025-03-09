import Integrations from '@/components/integrations/Integrations';

export default function IntegrationsPage() {
  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between max-sm:flex-wrap">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
            <p className="text-muted-foreground">
              Connect your AI support agent with other tools and services
            </p>
          </div>
          {/* <Button className="max-sm:mt-4 max-sm:w-full" onClick={handleOpen}>
            <Plus className="mr-2 h-4 w-4" />
            Add Source
          </Button> */}
        </div>

        <Integrations />
      </div>
    </div>
  );
}
