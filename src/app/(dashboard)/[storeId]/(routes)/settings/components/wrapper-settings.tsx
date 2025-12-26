"use client";

import Navbar from "@/components/widgets/navbar";
import React from "react";
import FormSetting from "./form-setting";
import { Store } from "@/generated/prisma";
import { useStoreModal } from "@/stores/use-store-modal";

interface WrapperSettingsProps {
  store: Store;
  role: string;
}

const WrapperSettings = ({ store, role }: WrapperSettingsProps) => {
  const { onOpen } = useStoreModal();

  return (
    <>
      <Navbar
        nameSection={"Settings"}
        description=""
        handleAction={onOpen}
        actionName="New Store"
      />
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-6">
          <FormSetting initialData={store} role={role} />
        </div>
      </main>
    </>
  );
};

export default WrapperSettings;
