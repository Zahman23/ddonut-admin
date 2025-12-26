"use client";

import SignUpForm from "@/components/auth/sign-up-form";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const PageRegister = () => {
  return (
    <div className="w-full max-w-md">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 relative overflow-hidden">
          <SignUpForm onClose={() => {}} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PageRegister;
