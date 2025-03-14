import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useDropzone } from '@uploadthing/react';
import {
  Book,
  CheckCircle2,
  Database,
  Expand,
  File,
  FileText,
  Globe,
  Loader2,
  Upload,
  X,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormLabelWithTooltip } from '@/components/FormLabelWithTooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MultipleSelector, { Option } from '@/components/ui/multi-select';
import { Progress } from '@/components/ui/progress';
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
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { API } from '@/lib/api';
import {
  createNewDatasouceSchema,
  CreateNewDatasourceParams,
} from '@/lib/schema/knowledge';
import { convertEmptyStringsToUndefined } from '@/lib/utils';
import { SourceType } from '@/types/interface/knowledge';
import { useAddKnowledgeMutation } from './useAddKnowledgeMutation';
import { useEditKnowledgeMutation } from './useEditKnowledgeMutation';
import { useKnowledgeModalStore } from './useKnowledgeModal';

export default function AddKnowledgeBaseModal() {
  const { source, open, handleClose } = useKnowledgeModalStore();

  return (
    <Sheet open={open} onOpenChange={handleClose} modal>
      <SheetContent
        side="right"
        className="custom-scrollbar max-h-screen w-full overflow-y-auto sm:min-w-[400px]">
        <SheetHeader>
          <SheetTitle>
            {source ? 'Edit Knowledge Source' : 'Add Knowledge Source'}
          </SheetTitle>
          <SheetDescription>
            {source
              ? 'Edit your knowledge source.'
              : 'Add a new source to your AI knowledge base.'}
          </SheetDescription>
        </SheetHeader>
        <AddKnowledgeBaseContent />
      </SheetContent>
    </Sheet>
  );
}

const SourceIcons = {
  web: Globe,
  document: FileText,
  database: Database,
  article: Book,
  text: File,
};

function AddKnowledgeBaseContent() {
  const { source, handleClose } = useKnowledgeModalStore();
  const [sourceType, setSourceType] = useState<SourceType>(
    source?.type ?? 'DOCUMENT'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: addKnowledgeMutation, isPending } = useAddKnowledgeMutation();
  const { mutate: editKnowledgeMutation, isPending: isEditPending } =
    useEditKnowledgeMutation();
  const { attachments, isUploading, uploadProgress, startUpload, reset } =
    useMediaUpload();

  const { getInputProps, getRootProps } = useDropzone({
    onDrop: startUpload,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClick, ...rootProps } = getRootProps();

  const { data: agentsData } = useQuery({
    queryKey: ['agents'],
    queryFn: API.agent.getAllAgents,
  });

  const [multiSelectOptions, setMultiSelectOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (agentsData) {
      setMultiSelectOptions(
        agentsData.map((agent) => ({
          label: agent.name,
          value: agent.id,
        }))
      );
    }
  }, [agentsData]);

  const form = useForm<CreateNewDatasourceParams>({
    resolver: zodResolver(createNewDatasouceSchema),
    defaultValues: {
      name: source?.name ?? '',
      agentIds: source?.agentIds ?? [],
      category: source?.category ?? '',
      content: source?.content ?? '',
      description: source?.description ?? '',
      size: source?.size ?? 0,
      type: (source?.type as 'DOCUMENT') ?? 'DOCUMENT',
      url: source?.url ?? undefined,
      fileUrl: source?.fileUrl ?? undefined,
    },
  });

  useEffect(() => {
    if (source) {
      form.setValue(
        'agentIds',
        source.agentIds.map((id) => id) //relasi agentonDatabase
      );
    }
  }, [source, form]);

  useEffect(() => {
    if (attachments.length) {
      form.setValue('fileUrl', attachments[0].url);
    }
  }, [attachments, form]);

  const onSubmit = (data: CreateNewDatasourceParams) => {
    const convertedData = convertEmptyStringsToUndefined(data);

    if (isPending || isEditPending) return;

    if (convertedData.type === 'DOCUMENT') {
      if (attachments.length > 0) {
        convertedData.size = attachments[0].file.size;
      }
    }

    if (convertedData.type === 'TEXT') {
      if (convertedData.content) {
        convertedData.size = convertedData.content.length;
      }
    }

    if (source) {
      editKnowledgeMutation(
        { datasourceId: source.id, ...convertedData },
        {
          onSuccess: () => {
            toast.success('Source updated successfully');
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

    addKnowledgeMutation(convertedData, {
      onSuccess: () => {
        toast.success('Source added successfully');
        setSourceType('WEB'); // back to default
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
                <FormLabelWithTooltip
                  label="Source name"
                  name="The name of your data source"
                />
                <FormControl>
                  <Input {...field} placeholder="My Portfolio Data" />
                </FormControl>
                <FormDescription className="sm:hidden">
                  The name of your data source
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="agentIds"
            render={({ field }) => (
              <FormItem>
                <FormLabelWithTooltip
                  label="Agent"
                  name="Choose the agent to use for this source"
                />
                <FormControl>
                  <MultipleSelector
                    placeholder="Select agent to use"
                    value={
                      source
                        ? field.value.map((id: string) => {
                            const agent = agentsData?.find((a) => a.id === id);

                            return {
                              label: agent?.name,
                              value: id,
                            };
                          })
                        : []
                    }
                    defaultOptions={
                      source
                        ? field.value.map((id: string) => {
                            const agent = agentsData?.find((a) => a.id === id);

                            return {
                              label: agent?.name,
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
                      <p className="text-center text-xs">No agent found.</p>
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabelWithTooltip label="Type" name="Select source type" />
                <FormControl>
                  <Select
                    onValueChange={(e) => {
                      setSourceType(e as SourceType);
                      field.onChange(e);
                    }}
                    defaultValue={field.value}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select source type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem disabled value="WEB">
                        <span className="flex items-center">
                          <SourceIcons.web className="mr-2 size-4" /> Web
                        </span>
                      </SelectItem>
                      <SelectItem value="DOCUMENT">
                        <span className="flex items-center">
                          <SourceIcons.document className="mr-2 size-4" />{' '}
                          Document
                        </span>
                      </SelectItem>
                      <SelectItem disabled value="DATABASE">
                        <span className="flex items-center">
                          <SourceIcons.database className="mr-2 size-4" />{' '}
                          Database
                        </span>
                      </SelectItem>
                      <SelectItem disabled value="ARTICLE">
                        <span className="flex items-center">
                          <SourceIcons.article className="mr-2 size-4" />{' '}
                          Article
                        </span>
                      </SelectItem>
                      <SelectItem value="TEXT">
                        <span className="flex items-center">
                          <SourceIcons.text className="mr-2 size-4" /> Text
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className="sm:hidden">
                  Select source type
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabelWithTooltip
                  label="Category"
                  name="Put category ex: Documentation"
                />
                <FormControl>
                  <Input {...field} placeholder="Portfolio" />
                </FormControl>
                <FormDescription className="sm:hidden">
                  Enter category ex: Documentation
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
                  name="Description this will help agent to understand your data source"
                />
                <FormControl>
                  <Input
                    {...field}
                    placeholder="This is about my personal info"
                  />
                </FormControl>
                <FormDescription className="sm:hidden">
                  Description this will help agent to understand your data
                  source
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dynamic fields based on source type */}
          {sourceType === 'WEB' && (
            <FormField
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabelWithTooltip
                    label="Website URL"
                    name="URL of your website ex: https://mywebsite.com"
                  />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://github.com/mgalihpp"
                    />
                  </FormControl>
                  <FormDescription className="sm:hidden">
                    URL of your website ex: https://mywebsite.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {sourceType === 'DOCUMENT' && (
            // <div className="grid gap-2">
            //   <Label htmlFor="file">Upload Document</Label>
            //   <div className="flex items-center gap-2">
            //     <Input id="file" type="file" className="flex-1 cursor-pointer" />
            //     <Button variant="outline" size="icon">
            //       <Upload className="h-4 w-4" />
            //     </Button>
            //   </div>
            //   <p className="text-muted-foreground text-xs">
            //     Supported formats: PDF, DOCX, TXT, CSV (Max 10MB)
            //   </p>
            // </div>
            <FormField
              name="fileUrl"
              render={() => (
                <FormItem>
                  <FormLabelWithTooltip
                    label="Upload Document"
                    name="a Document in PDF, DOCX, TXT, CSV format"
                  />
                  <div
                    className="hover:bg-muted/50 group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-all duration-200"
                    {...rootProps}>
                    {!isUploading && !attachments.length && (
                      <div
                        className="flex flex-col items-center justify-center gap-2 text-center"
                        onClick={() => fileInputRef.current?.click()}>
                        <div className="bg-muted group-hover:bg-background rounded-full p-3 transition-colors">
                          <Upload className="text-muted-foreground h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            Drag & drop your file here or click to browse
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Supports PDF, DOCX, TXT, CSV formats
                          </p>
                        </div>
                      </div>
                    )}

                    {isUploading && (
                      <div className="w-full space-y-4">
                        <div className="flex w-full items-center justify-between gap-2">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="bg-primary/10 animate-pulse rounded-md p-2">
                              <File className="text-primary h-4 w-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="truncate text-sm font-medium">
                                {attachments[0].file.name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                Uploading...
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-medium">
                            {uploadProgress}%
                          </span>
                        </div>

                        <Progress value={uploadProgress} className="h-2" />

                        {uploadProgress === 100 && (
                          <div className="text-primary flex items-center justify-center gap-1 text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Upload complete!</span>
                          </div>
                        )}
                      </div>
                    )}

                    {attachments.length > 0 && !isUploading && (
                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="bg-primary/10 rounded-md p-2">
                            <File className="text-primary h-4 w-4" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium">
                              {attachments[0].file.name}
                            </p>
                            <Badge>
                              {attachments[0].file.size / 1024 / 1024 > 1
                                ? `${(
                                    attachments[0].file.size /
                                    1024 /
                                    1024
                                  ).toFixed(2)} MB`
                                : `${(attachments[0].file.size / 1024).toFixed(2)} KB`}
                            </Badge>
                            <p className="text-muted-foreground text-xs">
                              Uploaded Successfull
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => reset()}
                          type="button">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <FormControl>
                      <Input
                        {...getInputProps()}
                        ref={fileInputRef}
                        type="file"
                        className="flex-1 cursor-pointer"
                      />
                    </FormControl>
                  </div>

                  <FormDescription className="sm:hidden">
                    a Document in PDF, DOCX, TXT, CSV format
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {sourceType === 'TEXT' && (
            <FormField
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabelWithTooltip
                    label="Text"
                    name="Content your data source in text format"
                  />

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="circle" className="ml-2">
                        <Expand />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="custom-scrollbar max-h-screen max-w-2xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Content</DialogTitle>
                        <DialogDescription>
                          Content your data source in text format
                        </DialogDescription>
                      </DialogHeader>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Hello my name is John Doe, i am 25 years old, and i live in New York City. I am a Software Engineer in Meta, currently focusing on bug fixing."
                          className="h-96"
                        />
                      </FormControl>
                    </DialogContent>
                  </Dialog>

                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Hello my name is John Doe, i am 25 years old, and i live in New York City. I am a Software Engineer in Meta, currently focusing on bug fixing."
                      className="min-h-[150px]"
                    />
                  </FormControl>
                  <FormDescription className="sm:hidden">
                    Content your data source in text format
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {sourceType === 'DATABASE' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="hostname">Hostname</Label>
                <Input id="hostname" placeholder="db.example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="port">Port</Label>
                  <Input id="port" placeholder="3306" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="database">Database</Label>
                  <Input id="database" placeholder="mydatabase" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="dbuser" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="table">Table/Collection</Label>
                <Input id="table" placeholder="users" />
              </div>
            </>
          )}

          {sourceType === 'ARTICLE' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="title">Article Title</Label>
                <Input id="title" placeholder="Enter article title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" placeholder="Enter author name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="articleContent">Article Content</Label>
                <Textarea
                  id="articleContent"
                  placeholder="Enter article content"
                  className="min-h-[150px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="articleUrl">Source URL (optional)</Label>
                <Input
                  id="articleUrl"
                  placeholder="https://blog.example.com/article"
                />
              </div>
            </>
          )}
        </div>

        <SheetFooter className="gap-2">
          <Button type="submit" disabled={isPending || isEditPending}>
            {isPending || isEditPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : source ? (
              'Update Source'
            ) : (
              'Add Source'
            )}
          </Button>
          <Button type="button" variant="cancel" onClick={() => handleClose()}>
            Cancel
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
