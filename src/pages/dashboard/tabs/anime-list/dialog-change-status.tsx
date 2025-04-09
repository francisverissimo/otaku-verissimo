import { useState, forwardRef, useImperativeHandle } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

export type TDialogChangeStatusHandle = {
  handleDialog: (data: TDialogState) => void
}

type TDialogState = { open: boolean; status: string } | null

type TDialogChangeStatusProps = {
  onClickStay: () => void
  onClickMove: (status: string) => void
  onClickCancel: () => void
}

export const DialogChangeStatus = forwardRef<TDialogChangeStatusHandle, TDialogChangeStatusProps>(
  function ({ onClickStay, onClickMove, onClickCancel }, ref) {
    const [dialogState, setDialogState] = useState<TDialogState>(null)

    function handleDialog(data: TDialogState) {
      setDialogState(data)
    }

    useImperativeHandle(ref, () => {
      return {
        handleDialog,
      }
    })

    if (!dialogState) {
      return null
    }

    return (
      <Dialog.Root open>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed inset-0 z-50 my-auto flex h-fit w-full flex-col justify-center overflow-hidden bg-zinc-700 outline-none md:inset-auto md:top-1/2 md:left-1/2 md:max-w-[600px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md">
            <Dialog.Title className="m-4 text-xl font-medium">
              Move to {dialogState.status}
            </Dialog.Title>

            <Dialog.Description className="m-4 text-xl leading-normal">
              Do you want to set this entry into{' '}
              <span className="text-main">{dialogState.status}</span>?
            </Dialog.Description>

            <div className="flex justify-center gap-x-4 p-2">
              <Dialog.Close
                onClick={() => {
                  onClickStay()
                  setDialogState(null)
                }}
                className="flex w-full items-center justify-center border-none bg-sky-500/10 p-4 leading-none font-medium text-sky-400 uppercase outline-none hover:bg-sky-500/20 hover:ring-2 hover:ring-sky-400 focus:bg-sky-500/20 focus:ring-2 focus:ring-sky-400"
              >
                stay
              </Dialog.Close>

              <Dialog.Close
                onClick={() => {
                  onClickMove(dialogState.status)
                  setDialogState(null)
                }}
                autoFocus
                className="ooutline-none flex w-full items-center justify-center bg-green-500/10 p-4 leading-none font-medium text-green-400 uppercase outline-none hover:bg-green-500/20 hover:ring-2 hover:ring-green-400 focus:bg-green-500/20 focus:ring-2 focus:ring-green-400"
              >
                move
              </Dialog.Close>
            </div>

            <Dialog.Close
              onClick={() => {
                onClickCancel()
                setDialogState(null)
              }}
              className="absolute top-[10px] right-[10px] inline-flex items-center justify-center px-1 text-red-400 outline-none hover:bg-red-500/30 hover:text-red-300 hover:ring-2 hover:ring-red-300 focus:bg-red-500/30 focus:text-red-300 focus:ring-2 focus:ring-red-300"
              aria-label="Cancel"
            >
              CANCEL
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }
)
