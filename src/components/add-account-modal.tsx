"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription } from "./ui/dialog";
import SignUpForm from "./auth/sign-up-form";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Separator } from "./ui/separator";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAccountModal = ({ isOpen, onClose }: AddAccountModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-2xl font-semibold tracking-tight text-balance">
          Create New User
        </DialogTitle>
        <DialogDescription>
          Sign up to get started with your new account
        </DialogDescription>
        <Separator className="space-y-6" />
        <SignUpForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountModal;
