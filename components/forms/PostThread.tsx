"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { threadValidation } from "@/lib/validations/threadValidation";
import { createThread } from "@/lib/serverActions/thread.actions";

const PostThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof threadValidation>>({
    resolver: zodResolver(threadValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof threadValidation>) => {
    try {
      await createThread({
        author: userId,
        text: values.thread,
        path: pathname,
      });

      router.push("/");

      console.log("Posted");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10 mt-10"
        >
          {/* Content */}

          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base-semibold text-light-2">
                  Content
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="account-form_input no-focus"
                    rows={15}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-500">
            Post thread
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PostThread;
