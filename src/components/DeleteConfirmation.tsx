import { Task } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({
  isOpen,
  task,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center animate-in zoom-in-50 duration-300">
              <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
            </div>
            <div className="flex-1">
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{task.title}</span>?
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} className="transition-all hover:scale-105 active:scale-95">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="transition-all hover:scale-105 active:scale-95">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
