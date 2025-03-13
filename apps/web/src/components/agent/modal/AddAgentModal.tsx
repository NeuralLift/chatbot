import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormLabelWithTooltip } from '@/components/FormLabelWithTooltip';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MultipleSelector, { Option } from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { API } from '@/lib/api';
import { CreateNewAgentParams, createNewAgentSchema } from '@/lib/schema/agent';
import { useAddAgentMutation } from './useAddAgentMutation';
import { useAgentModalStore } from './useAgentModal';
import { useEditAgentMutation } from './useEditAgentMutation';

export default function AddAgentModal() {
  const { agent, open, handleClose } = useAgentModalStore();

  return (
    <Sheet open={open} onOpenChange={handleClose} modal>
      <SheetContent
        side="right"
        className="custom-scrollbar max-h-screen w-full overflow-y-auto sm:min-w-[400px]">
        <SheetHeader>
          <SheetTitle>{agent ? 'Edit Agent' : 'Add Agent'}</SheetTitle>
          <SheetDescription>
            {agent
              ? 'Edit an existing agent'
              : 'Add a new agent to your AI support agents'}
          </SheetDescription>
        </SheetHeader>
        <AddAgentContent />
      </SheetContent>
    </Sheet>
  );
}

function AddAgentContent() {
  const { agent, handleClose } = useAgentModalStore();
  const { mutate: addAgentMutation, isPending } = useAddAgentMutation();
  const { mutate: editAgentMutation, isPending: isEditPending } =
    useEditAgentMutation();

  const { data: sourcesData } = useQuery({
    queryKey: ['sources'],
    queryFn: API.datasource.getAllDatasources,
  });

  const [multiSelectOptions, setMultiSelectOptions] = useState<Option[]>([]);

  const form = useForm<CreateNewAgentParams>({
    resolver: zodResolver(createNewAgentSchema),
    defaultValues: {
      name: agent?.name ?? '',
      datasourceIds:
        agent?.datasources.map((datasource) => datasource.id) ?? [],
      description: agent?.description ?? '',
      model: agent?.model ?? 'groq/llama-3.3-70b-versatile',
      type: 'AI',
      prompt_variables: {},
      system_prompt: agent?.system_prompt ?? '',
      user_prompt: 'ok ready bro',
    },
  });

  useEffect(() => {
    if (sourcesData) {
      setMultiSelectOptions(
        sourcesData.map((source) => ({
          label: source.name,
          value: source.id,
        }))
      );
    }
  }, [sourcesData]);

  useEffect(() => {
    if (agent) {
      form.setValue(
        'datasourceIds',
        agent?.datasourceIds.map((id) => id) ?? []
      );
    }
  }, [agent, form]);

  const onSubmit = (data: CreateNewAgentParams) => {
    if (isPending || isEditPending) return;

    // if agent exists so update it
    if (agent) {
      editAgentMutation(
        {
          agentId: agent.id,
          ...data,
        },
        {
          onSuccess() {
            toast.success('Agent updated successfully');
            handleClose();
          },
          onError: (error) => {
            console.error(error);
            toast.error(error.message);
          },
        }
      );

      return;
    }

    addAgentMutation(data, {
      onSuccess() {
        toast.success('Agent added successfully');
        handleClose();
      },
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="my-4 space-y-6">
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabelWithTooltip label="Agent Name" name="Agent Name" />
                <FormControl>
                  <Input {...field} placeholder="Agent Name" />
                </FormControl>

                <FormDescription className="sm:hidden">
                  The name of your agent
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="datasourceIds"
            render={({ field }) => (
              <FormItem>
                <FormLabelWithTooltip
                  label="Datasources"
                  name="Choose the datasources to use for this agent"
                />
                <FormControl>
                  <MultipleSelector
                    placeholder="Select datasources to use"
                    value={
                      agent
                        ? field.value.map((id: string) => {
                            const datasource = sourcesData?.find(
                              (d) => d.id === id
                            );

                            console.log(datasource);

                            return {
                              label: datasource?.name,
                              value: id,
                            };
                          })
                        : []
                    }
                    defaultOptions={
                      agent
                        ? field.value.map((id: string) => {
                            const datasource = sourcesData?.find(
                              (d) => d.id === id
                            );

                            return {
                              label: datasource?.name,
                              value: id,
                            };
                          })
                        : []
                    }
                    options={multiSelectOptions}
                    onChange={(options) => {
                      field.onChange(options.map((o) => o.value));
                    }}
                    emptyIndicator={
                      <p className="text-center text-xs">
                        No datasource found.
                      </p>
                    }
                  />
                </FormControl>
                <FormDescription className="sm:hidden">
                  Choose the agent to use for this source
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabelWithTooltip
                  label="Description"
                  name="Description this will help what your agent can do"
                />
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Your job is to help people to answer any issues they are running into."
                  />
                </FormControl>
                <FormDescription className="sm:hidden">
                  Description this will help what your agent can do
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabelWithTooltip label="Type" name="Select agent type" />
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI">AI</SelectItem>
                      <SelectItem value="HUMAN">Human</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className="sm:hidden">
                  Select agent type
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="system_prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabelWithTooltip
                  label="System Prompt"
                  name="System Prompt it is used to provide the agent with some initial instructions or context for the conversation."
                />
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="You are a helpful assistant."
                  />
                </FormControl>
                <FormDescription className="sm:hidden">
                  System Prompt it is used to provide the agent with some
                  initial instructions or context for the conversation.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SheetFooter className="gap-2">
          <Button type="submit" disabled={isPending || isEditPending}>
            {isPending ||
              (isEditPending && <Loader2 className="size-5 animate-spin" />)}
            {agent ? 'Edit Agent' : 'Add Agent'}
          </Button>
          <Button type="button" variant="cancel" onClick={() => handleClose()}>
            Cancel
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
