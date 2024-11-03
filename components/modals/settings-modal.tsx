"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/clerk-react";

export const SettingsModal = () => {
  const settings = useSettings();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        {/* Add DialogTitle for screen reader accessibility */}
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="sr-only">Settings</DialogTitle>
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Jotion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>User account</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize your account's information
            </span>
          </div>
          <div className="relative z-[2050]">
            <UserButton 
              // A fix based on the github comment below
              // Seems to do very fine
              // https://github.com/clerk/javascript/issues/3739#issuecomment-2278599545
              appearance={{
                elements: {
                  userButtonPopoverRootBox: {
                    pointerEvents: "auto",
                  },
                },
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
