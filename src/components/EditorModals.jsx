import { useStore } from '../store/useStore';
import { Palette, History, CloudUpload } from 'lucide-react';
import Modal from './Modal';
import ThemeTab from './editor/ThemeTab';
import HistoryTab from './editor/HistoryTab';
import DeployTab from './DeployTab';

export default function EditorModals() {
  const { activeModal, setActiveModal } = useStore();
  if (!activeModal) return null;

  const close = () => setActiveModal(null);

  if (activeModal === 'theme') {
    return (
      <Modal title="自訂配色" icon={<Palette size={16} className="text-primary" />} onClose={close} maxWidth="max-w-xl">
        <ThemeTab />
      </Modal>
    );
  }
  if (activeModal === 'history') {
    return (
      <Modal title="版本紀錄" icon={<History size={16} className="text-primary" />} onClose={close} maxWidth="max-w-2xl">
        <HistoryTab />
      </Modal>
    );
  }
  if (activeModal === 'deploy') {
    return (
      <Modal title="公開部署" icon={<CloudUpload size={16} className="text-indigo-600" />} onClose={close} maxWidth="max-w-2xl">
        <DeployTab />
      </Modal>
    );
  }
  return null;
}
