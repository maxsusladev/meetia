import { agentsInsertSchema } from "@/modules/agents/schemas";
import { AgentGetOne } from "@/modules/agents/types";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GeneratedAvatar } from "@/components/ganerated-avatar";
import { Textarea } from "@/components/ui/textarea";

import {
    FormControl,
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne
}

export const AgentForms = ({
    onSuccess,
    onCancel,
    initialValues

}: AgentFormProps) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient()

    const createAgents = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions()
                )

                if (initialValues?.id) {
                    queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initialValues.id })
                    )
                }
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    )

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? "",
        }
    })

    const isEdit = !!initialValues?.id
    const isPending = createAgents.isPending

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (isEdit) {
            console.log("ToDo: updateAgents")
        } else {
            createAgents.mutate(values)
        }
    }


    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="w-16 h-16 shrink-0  rounded-full overflow-hidden border">
                    <GeneratedAvatar
                        seed={form.watch("name")}
                        variant="botttsNeutral"
                        className="w-full h-full"
                    />
                </div>
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g John" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="instructions"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Insructions</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="You are a helpful math assistant that can answer questions and help with tasks" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className=" flex justify-between gap-x-2">
                    {onCancel && (
                        <Button
                            variant="ghost"
                            disabled={isPending}
                            type="button"
                            onClick={() => onCancel()}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button disabled={isPending} type="submit">
                        {isEdit ? "Update" : "Create"}
                    </Button>
                </div>
            </form>

        </Form>
    )
}