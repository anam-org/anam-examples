import { Button, Modal } from 'flowbite-react';

export default function AlertModal({
  show,
  header,
  body,
  onClose,
}: {
  show: boolean;
  header: string;
  body: string;
  onClose: () => void;
}) {
  return (
    <Modal dismissible show={show} onClose={onClose}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray- dark:text-gray-400">
            {body}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="blue" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
