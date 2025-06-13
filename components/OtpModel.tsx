"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { verifySecret } from "@/lib/action/user.action";
import { useRouter } from "next/navigation";

export const OtpModel = ({
  accountId,
  email,
}: {
  email: string;
  accountId: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionId = await verifySecret({ accountId, password });

      if (sessionId) {
        router.push("/");
      }
    } catch (error) {
      console.log("failed to verify otp: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="flex flex-col items-center justify-center py-12">
        <AlertDialogHeader className="relative flex flex-col items-center justify-center">
          <AlertDialogTitle className="">Enter Your OTP</AlertDialogTitle>
          <p
            onClick={() => setIsOpen(false)}
            className="absolute top-[-20px] right-[-40px] text-2xl cursor-pointer"
          >
            &times;
          </p>
          <AlertDialogDescription>
            We&apos;ve sent a code to{" "}
            <span>{"ansariali.developer@gmail.com"}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup>
            <InputOTPSlot index={0} className="border-zinc-400" />
            <InputOTPSlot index={1} className="border-zinc-400" />
            <InputOTPSlot index={2} className="border-zinc-400" />
            <InputOTPSlot index={3} className="border-zinc-400" />
            <InputOTPSlot index={4} className="border-zinc-400" />
            <InputOTPSlot index={5} className="border-zinc-400" />
          </InputOTPGroup>
        </InputOTP>
        <AlertDialogFooter className="grid grid-cols-1">
          <AlertDialogAction onClick={handleSubmit} type="button">
            {isLoading ? "Please wait" : "Submit"}
          </AlertDialogAction>
          <div>
            Didn&apos;t get a code?
            <Button type="button" variant={"link"}>
              click to resend
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
