import { formatDateTimeLong } from "@/lib/utils";
import { type Visit } from "@/server/api/routers/visit";
import { api } from "@/trpc/react";
import { Dialog, Transition } from "@headlessui/react";
import { type Status } from "@prisma/client";
import { notification } from "antd";
import { Fragment } from "react";

type Props = {
  show: boolean;
  closeModal: () => void;
  data: Visit | null;
  title: string;
  status: Status;
};

export default function ModalConfirm({ show, closeModal, data, title, status }: Props) {
  const utils = api.useUtils();
  const { mutate: handleConfirm } = api.visit.confirm.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col gap-4">
                <Dialog.Title as="h6" className="font-semibold">
                  {title}
                </Dialog.Title>
                <section>
                  <p>Nama: {data?.visitorName}</p>
                  <p>Perusahaan: {data?.visitorCompany}</p>
                  <p>Waktu berkunjung: {data?.startTime && formatDateTimeLong(data.startTime)}</p>
                </section>
                <section className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="w-fullpx-4 py-2 bg-blue text-light rounded-md font-medium"
                    onClick={closeModal}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-green text-light rounded-md font-medium"
                    onClick={() => {
                      if (data) handleConfirm({ status, id: data.id });
                      notification.success({ message: "Berhasil dikonfirmasi" });
                      closeModal();
                    }}
                  >
                    Konfirmasi
                  </button>
                </section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
