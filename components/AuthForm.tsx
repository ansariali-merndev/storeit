"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createAccount } from "@/lib/action/user.action";
import { useState } from "react";
import { OtpModel } from "./OtpModel";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullname:
      formType === "sign-up"
        ? z.string().min(2).max(15)
        : z.string().optional(),
  });
};

export default function AuthForm({ type }: { type: FormType }) {
  const [accountId, setAccountId] = useState("null");
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullname: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setIsError("");
    try {
      const user = await createAccount({
        fullname: values.fullname || "",
        email: values.email,
      });
      setAccountId(user.accountId);
    } catch (error: any) {
      console.error(error);
      setIsError(error?.message || "Unable to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h1 className="text-2xl font-bold white">
            {type === "sign-up" ? "Sign Up" : "Sign In"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-90 white">
                  <FormLabel className="text-light-100 pt-2 body-2 w-full">
                    Fullname:{" "}
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="order-none shadow-none p-2 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-light-200 body-2"
                      placeholder="Type Your Fullname"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 w-90 white">
                <FormLabel className="text-light-100 pt-2 body-2 w-full">
                  Email:{" "}
                </FormLabel>
                <FormControl>
                  <Input
                    className="order-none shadow-none p-2 outline-none ring-offset-transparent focus:ring-transparent focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 placeholder:text-light-200 body-2"
                    placeholder="Email Address here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            className="bg-red-400 hover:bg-red-300 w-full cursor-pointer transition-all rounded-full"
            type="submit"
          >
            {isLoading ? "Please wait" : "submit"}
          </Button>
        </form>
        {isError && <p>Error: {isError}</p>}
      </Form>
      {true && (
        <OtpModel email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
}
