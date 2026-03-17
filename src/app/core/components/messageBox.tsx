import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, type LucideProps } from "lucide-react";
import { useState } from "react";

type MessageBoxProps = {
  title: string;
  descirption: string;
  MessageIcon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  isOpen: boolean;
  onColse: () => void;
};
export default function MessageBox({ title, descirption, MessageIcon, isOpen, onColse }: MessageBoxProps)
{
  const [isOpenState, setOpenState] = useState(isOpen);
  return (
    <Dialog open={ isOpenState }>
      <DialogContent dir="rtl" showCloseButton={ false }>
        { MessageIcon ? <MessageIcon /> : <AlertCircle /> }
        <DialogTitle>{ title }</DialogTitle>
        <DialogDescription>{ descirption }</DialogDescription>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={ () =>
            {
              setOpenState(false);
              onColse();
            } }
          >
            حسنا
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
