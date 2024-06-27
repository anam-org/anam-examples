'use client';
import Button from '@/components/Button';
import Panel from '@/components/Panel';
import AlertModal from '@/components/AlertModal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BUTTON_TEXT = process.env.NEXT_PUBLIC_BUTTON_TEXT || 'Book a room';

export default function Home() {
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);

  const proceedToSession = async () => {
    setDisabled(true);
    router.push('/session');
  };

  return (
    <>
      <Panel>
        <div className="flex flex-col space-y-6 items-center justify-center w-full h-full px-4">
          <Button
            text={BUTTON_TEXT}
            id="start"
            onClick={proceedToSession}
            disabled={disabled}
          />
        </div>
      </Panel>
    </>
  );
}
